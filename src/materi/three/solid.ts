import {
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  type Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three";
import { disposeObject } from "./stage";
import { bounds, edgeFrames, foldedEdges, foldedVertices, lateralFace, solidFacts, topLocal, type SolidFacts, type SolidSpec, type V2, type V3 } from "./solidMath";

/* Benda dari SolidSpec: alas, sisi tegak, dan tutup sebagai bidang terpisah yang
   terengsel, sehingga satu benda dapat dilipat dari jaring-jaring menjadi bangun utuh. */

export const COLORS = {
  alas: 0x8fb4ff,
  tutup: 0xb9d0ff,
  tegak: 0xffd4bb,
  sorot: 0xf59e0b,
  biru: 0x6b9bf2,
  hijau: 0x6fcf97,
  jingga: 0xffb366,
  ungu: 0xb59cf0,
  rusuk: 0x1e293b,
  titik: 0xc96442,
} as const;

const UP = new Vector3(0, 1, 0);
const AXIS_X = new Vector3(1, 0, 0);

function polygonGeometry(points: V2[]): BufferGeometry {
  const g = new BufferGeometry();
  const pos: number[] = [];
  const idx: number[] = [];
  points.forEach(([x, z]) => pos.push(x, 0, z));
  for (let i = 1; i < points.length - 1; i++) idx.push(0, i, i + 1);
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function outline(points: V2[]): LineLoop {
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(points.flatMap(([x, z]) => [x, 0, z]), 3));
  return new LineLoop(g, new LineBasicMaterial({ color: COLORS.rusuk }));
}

/** Tabung tipis antara dua titik (rusuk yang disorot). */
export function tube(a: Vector3, b: Vector3, radius: number, color: number): Mesh {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const mesh = new Mesh(new CylinderGeometry(radius, radius, 1, 10), new MeshLambertMaterial({ color }));
  mesh.scale.y = len;
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
  return mesh;
}

export function sphere(at: Vector3, radius: number, color: number): Mesh {
  const mesh = new Mesh(new SphereGeometry(radius, 16, 12), new MeshLambertMaterial({ color }));
  mesh.position.copy(at);
  return mesh;
}

/** Bidang bebas (mis. bidang diagonal) dari titik-titik 3D, setengah bening. */
export function polygonMesh(points: V3[], color: number, opacity: number): Group {
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(points.flat(), 3));
  const idx: number[] = [];
  for (let i = 1; i < points.length - 1; i++) idx.push(0, i, i + 1);
  g.setIndex(idx);
  g.computeVertexNormals();
  const mat = new MeshLambertMaterial({ color, side: DoubleSide, transparent: true, opacity, depthWrite: false });
  const group = new Group();
  group.add(new Mesh(g, mat));
  const o = new BufferGeometry();
  o.setAttribute("position", new Float32BufferAttribute(points.flat(), 3));
  group.add(new LineLoop(o, new LineBasicMaterial({ color })));
  return group;
}

export class Solid {
  /** Letakkan ini di panggung. Titik pusat bangun berada di titik asal. */
  readonly group = new Group();
  readonly spec: SolidSpec;
  readonly facts: SolidFacts;
  /** Jari-jari bola pembatas (untuk membingkai kamera). */
  readonly radius: number;
  /** Titik pusat bangun dalam koordinat alas, untuk menempatkan benda tambahan. */
  readonly center: V3;

  private readonly inner = new Group();
  private readonly faces: Mesh[] = [];
  private readonly hinges: { group: Group; base: Quaternion; sign: number; angle: number }[] = [];
  private topHinge: { group: Group; sign: number } | null = null;
  private markers = new Group();
  private fold = 1;
  private xray = false;
  private markerFlags = { vertices: false, edges: false };

  constructor(spec: SolidSpec, options: { net?: boolean } = {}) {
    this.spec = spec;
    this.facts = solidFacts(spec);
    const b = bounds(spec, Boolean(options.net));
    this.radius = b.radius;
    this.center = b.center;
    this.inner.position.set(-b.center[0], -b.center[1], -b.center[2]);
    this.group.add(this.inner);
    this.inner.add(this.markers);
    this.build();
    this.setFold(1);
  }

  private makeFace(points: V2[], color: number, role: "alas" | "tegak" | "tutup"): Mesh {
    const mat = new MeshLambertMaterial({ color, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const mesh = new Mesh(polygonGeometry(points), mat);
    mesh.add(outline(points));
    mesh.userData.role = role;
    mesh.userData.color = color;
    return mesh;
  }

  private build() {
    const { spec } = this;
    const frames = edgeFrames(spec.base);
    const base = this.makeFace(frames.map((f) => f.p), COLORS.alas, "alas");
    this.faces.push(base);
    this.inner.add(base);

    frames.forEach((f, k) => {
      const lf = lateralFace(spec, k);
      const X = new Vector3(f.e[0], 0, f.e[1]);
      const Z = new Vector3(f.w[0], 0, f.w[1]);
      const Y = new Vector3().crossVectors(Z, X);
      const baseQuat = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(X, Y, Z));
      // Putar pada sumbu X lokal sebesar +ψ menggerakkan Z ke arah −Y; kita ingin ke atas.
      const sign = Y.dot(UP) > 0 ? -1 : 1;
      const hinge = new Group();
      hinge.position.set(f.p[0], 0, f.p[1]);
      const face = this.makeFace(lf.local, COLORS.tegak, "tegak");
      hinge.add(face);
      this.faces.push(face);
      this.inner.add(hinge);
      this.hinges.push({ group: hinge, base: baseQuat, sign, angle: lf.finalAngle });

      if (spec.kind === "prisma" && k === 0) {
        const topHinge = new Group();
        topHinge.position.set(0, 0, spec.height);
        hinge.add(topHinge);
        this.topHinge = { group: topHinge, sign };
        this.topFace = this.makeFace(topLocal(spec, 0), COLORS.tutup, "tutup");
        topHinge.add(this.topFace);
      }
    });
    if (this.topFace) this.faces.push(this.topFace);
  }

  private topFace: Mesh | null = null;

  /** 0 = jaring-jaring rata, 1 = bangun utuh. */
  setFold(t: number) {
    this.fold = Math.min(1, Math.max(0, t));
    const q = new Quaternion();
    for (const h of this.hinges) {
      q.setFromAxisAngle(AXIS_X, h.sign * h.angle * this.fold);
      h.group.quaternion.copy(h.base).multiply(q);
    }
    if (this.topHinge) {
      this.topHinge.group.quaternion.setFromAxisAngle(AXIS_X, this.topHinge.sign * (Math.PI / 2) * this.fold);
    }
    this.markers.visible = this.fold > 0.999;
  }

  get faceCount() {
    return this.faces.length;
  }

  /** Warna satu bidang (indeks: 0 alas, 1..n sisi tegak, terakhir tutup untuk prisma). `null` = warna asli. */
  setFaceColor(index: number, color: number | null) {
    const mesh = this.faces[index];
    if (!mesh) return;
    (mesh.material as MeshLambertMaterial).color.setHex(color ?? (mesh.userData.color as number));
  }

  setFaceVisible(index: number, visible: boolean) {
    const mesh = this.faces[index];
    if (mesh) mesh.visible = visible;
  }

  setXray(on: boolean) {
    this.xray = on;
    for (const mesh of this.faces) {
      const m = mesh.material as MeshLambertMaterial;
      m.transparent = on;
      m.opacity = on ? 0.38 : 1;
      m.depthWrite = !on;
      m.needsUpdate = true;
    }
  }

  get isXray() {
    return this.xray;
  }

  /** Titik sudut (bola) dan rusuk (tabung) yang disorot; tampil hanya pada bangun utuh. */
  setMarkers(flags: { vertices?: boolean; edges?: boolean }) {
    const next = { vertices: Boolean(flags.vertices), edges: Boolean(flags.edges) };
    if (next.vertices === this.markerFlags.vertices && next.edges === this.markerFlags.edges) return;
    this.markerFlags = next;
    this.inner.remove(this.markers);
    disposeObject(this.markers);
    this.markers = new Group();
    this.markers.visible = this.fold > 0.999;
    // Kecil saja: garis setipis kawat dan titik sebesar kepala paku, apa pun ukuran bangunnya.
    const lineR = this.radius * 0.009;
    const dotR = this.radius * 0.022;
    if (next.edges) {
      for (const [a, b] of foldedEdges(this.spec)) this.markers.add(tube(new Vector3(...a), new Vector3(...b), lineR, COLORS.titik));
    }
    if (next.vertices) {
      for (const v of foldedVertices(this.spec)) this.markers.add(sphere(new Vector3(...v), dotR, COLORS.titik));
    }
    this.inner.add(this.markers);
  }

  /** Tambahkan benda dalam koordinat alas (y = 0 di alas); ikut terpusat bersama bangun. */
  addOverlay(object: Object3D) {
    this.inner.add(object);
  }

  removeOverlay(object: Object3D) {
    this.inner.remove(object);
  }

  dispose() {
    disposeObject(this.group);
  }
}
