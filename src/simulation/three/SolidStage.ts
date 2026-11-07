import {
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MOUSE,
  PerspectiveCamera,
  Scene,
  TOUCH,
  Vector3,
  WebGLRenderer,
  type AnimationAction,
  type AnimationClip,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { SolidModel } from "../math/bangunRuangData";

/* ------------------------------------------------------------------ *
 *  Panggung 3D untuk model .glb (three.js), tanpa ketergantungan React.
 *
 *  - Latar putih, cahaya mengikuti kamera sehingga warna selalu terbaca.
 *  - OrbitControls: putar (1 jari / klik kiri), zoom (cubit / roda),
 *    geser (2 jari / klik kanan).
 *  - Animasi bawaan file dimainkan dengan waktu yang diatur sendiri,
 *    jadi bisa jeda, ulang, geser waktu, dan ubah kecepatan.
 *  - Render hanya saat ada perubahan (hemat baterai ponsel).
 * ------------------------------------------------------------------ */

/** Semua model diskalakan agar jari-jari bola pembatasnya sama. */
const RADIUS = 2;
const VIEW_DIRECTION = new Vector3(0.8, 0.62, 1).normalize();
const XRAY_OPACITY = 0.38;
/** Kubus dengan y di atas nilai ini dianggap sudah terangkat dari tumpukan. */
const AWAY_Y = 20;
/** Jeda di akhir animasi sebelum mengulang (mode ulangi otomatis), dalam detik. */
const LOOP_HOLD = 1.2;

export interface StageCounts {
  /** Kubus yang tampak (untuk model berlapis) atau tersisa di tumpukan (untuk penghitung). */
  value: number;
  total: number;
}

export interface StageEvents {
  onTime: (time: number, playing: boolean) => void;
  onCounts: (counts: StageCounts | null) => void;
  /** Dipanggil sekali saat pengguna pertama kali menyentuh model. */
  onInteract: () => void;
}

export interface StageModelInfo {
  duration: number;
  /** Banyak lapisan (model berlapis), 0 bila tidak ada. */
  layerCount: number;
}

interface MaterialRecord {
  material: Material;
  transparent: boolean;
  opacity: number;
  depthWrite: boolean;
}

interface Loaded {
  def: SolidModel;
  /** Dipasang di scene; berisi `root` yang sudah diskalakan dan dipusatkan. */
  pivot: Group;
  root: Group;
  mixer: AnimationMixer | null;
  actions: AnimationAction[];
  duration: number;
  edges: LineSegments[];
  materials: MaterialRecord[];
  cubes: Object3D[];
  levelOf: number[];
  levelCount: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export class SolidStage {
  private readonly container: HTMLElement;
  private readonly events: StageEvents;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(36, 1, 0.1, 200);
  private readonly controls: OrbitControls;
  private readonly loader = new GLTFLoader();
  private readonly edgeMaterial = new LineBasicMaterial({ color: 0x1e293b });
  private readonly cache = new Map<string, Promise<Loaded>>();
  private readonly resizeObserver: ResizeObserver;

  private current: Loaded | null = null;
  private loadToken = 0;
  private raf = 0;
  private lastFrame = 0;
  private disposed = false;
  private dirty = true;
  private userMoved = false;
  private notifiedInteract = false;

  private time = 0;
  private playing = false;
  private speed = 1;
  private loop = false;
  private hold = 0;
  private lastEmit = -1;

  private showEdges = true;
  private xray = false;
  private layerLimit = Infinity;
  private lastCount = -1;

  constructor(container: HTMLElement, events: StageEvents) {
    this.container = container;
    this.events = events;

    // Bila WebGL tidak tersedia, konstruktor melempar galat; pemanggil menampilkan pesan.
    this.renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(new Color(0xffffff), 1);
    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.setAttribute("role", "img");
    container.appendChild(canvas);

    canvas.addEventListener("webglcontextlost", this.onContextLost);
    canvas.addEventListener("webglcontextrestored", this.onContextRestored);

    // Cahaya: langit putih + cahaya searah yang menempel pada kamera.
    this.scene.add(new HemisphereLight(0xffffff, 0xcdd3df, 1.7));
    const headlight = new DirectionalLight(0xffffff, 1.9);
    headlight.position.set(0.6, 1, 0.9);
    this.camera.add(headlight);
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.rotateSpeed = 0.9;
    this.controls.zoomSpeed = 1.1;
    this.controls.screenSpacePanning = true;
    this.controls.autoRotateSpeed = 1.6;
    this.controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
    this.controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    this.controls.addEventListener("start", () => {
      this.userMoved = true;
      if (!this.notifiedInteract) {
        this.notifiedInteract = true;
        this.events.onInteract();
      }
    });
    this.controls.addEventListener("change", () => {
      // Jaga agar model tidak bisa digeser terlalu jauh hingga hilang dari layar.
      const limit = RADIUS * 1.5;
      if (this.controls.target.length() > limit) this.controls.target.setLength(limit);
      this.dirty = true;
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.raf = requestAnimationFrame(this.tick);
  }

  /* ───────── Pemuatan model ───────── */

  /** Memuat (atau mengambil dari cache) lalu menampilkan model. */
  async show(def: SolidModel, autoplay: boolean): Promise<StageModelInfo> {
    const token = ++this.loadToken;
    const loaded = await this.getLoaded(def);
    if (this.disposed || token !== this.loadToken) throw new Error("dibatalkan");

    if (this.current) this.scene.remove(this.current.pivot);
    this.current = loaded;
    this.scene.add(loaded.pivot);

    this.time = 0;
    this.hold = 0;
    this.lastEmit = -1;
    this.lastCount = -1;
    this.layerLimit = Infinity;
    this.applyTime(loaded, 0);
    this.applyEdges(loaded);
    this.applyXray(loaded);
    this.applyLayers(loaded);
    this.userMoved = false;
    this.resetView();

    this.playing = autoplay && loaded.duration > 0;
    this.emitTime(true);
    this.emitCounts(true);
    this.dirty = true;
    return { duration: loaded.duration, layerCount: loaded.levelCount };
  }

  /** Mengunduh model lain di latar belakang agar perpindahan terasa instan. */
  async prefetch(defs: SolidModel[]) {
    for (const def of defs) {
      if (this.disposed) return;
      try {
        await this.getLoaded(def);
      } catch {
        /* diabaikan: akan dicoba lagi saat model dipilih */
      }
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
  }

  private getLoaded(def: SolidModel): Promise<Loaded> {
    const cached = this.cache.get(def.id);
    if (cached) return cached;
    const promise: Promise<Loaded> = this.loader
      .loadAsync(def.file)
      .then((gltf) => this.prepare(def, gltf.scene, gltf.animations));
    // Bila gagal, hapus dari cache supaya bisa dicoba lagi.
    promise.catch(() => this.cache.delete(def.id));
    this.cache.set(def.id, promise);
    return promise;
  }

  private prepare(def: SolidModel, root: Group, clips: AnimationClip[]): Loaded {
    const materials: MaterialRecord[] = [];
    const seen = new Set<Material>();
    const edges: LineSegments[] = [];
    const meshes: Mesh[] = [];

    root.traverse((object) => {
      if ((object as Mesh).isMesh) meshes.push(object as Mesh);
    });

    for (const mesh of meshes) {
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of list) {
        if (seen.has(material)) continue;
        seen.add(material);
        // Tanpa peta lingkungan, bahan logam tampak gelap: paksa tidak berlogam.
        if ("metalness" in material) (material as MeshStandardMaterial).metalness = 0;
        // Sisi bagian dalam/bidang tipis (jaring-jaring) harus tetap terlihat dari belakang.
        material.side = DoubleSide;
        // Dorong bidang sedikit ke belakang agar garis rusuk tidak "berkedip" di atasnya.
        material.polygonOffset = true;
        material.polygonOffsetFactor = 1;
        material.polygonOffsetUnits = 1;
        materials.push({
          material,
          transparent: material.transparent,
          opacity: material.opacity,
          depthWrite: material.depthWrite,
        });
      }
      const line = new LineSegments(new EdgesGeometry(mesh.geometry, 25), this.edgeMaterial);
      line.matrixAutoUpdate = true;
      mesh.add(line);
      edges.push(line);
    }

    // Animasi bawaan file.
    let mixer: AnimationMixer | null = null;
    const actions: AnimationAction[] = [];
    let duration = 0;
    if (clips.length > 0) {
      mixer = new AnimationMixer(root);
      for (const clip of clips) {
        const action = mixer.clipAction(clip);
        action.play();
        actions.push(action);
        duration = Math.max(duration, clip.duration);
      }
    }

    // Kubus satuan = anak langsung scene (dipakai penghitung dan penampil lapisan).
    const cubes = root.children.filter((child) => child.children.length > 0 || (child as Mesh).isMesh);
    let levelOf: number[] = [];
    let levelCount = 0;
    if (def.layers) {
      const ys: number[] = cubes.map((cube) => cube.position.y);
      const sorted = [...new Set(ys.map((y) => Math.round(y * 100) / 100))].sort((a, b) => a - b);
      // Satu lapisan = kelompok y yang berdekatan (selisih < 1 satuan).
      const levels: number[] = [];
      let start = 0;
      for (let i = 1; i <= sorted.length; i++) {
        if (i === sorted.length || sorted[i] - sorted[i - 1] > 1) {
          levels.push((sorted[start] + sorted[i - 1]) / 2);
          start = i;
        }
      }
      levelOf = ys.map((y) => levels.reduce((best, level, index) => (Math.abs(level - y) < Math.abs(levels[best] - y) ? index : best), 0));
      levelCount = levels.length;
    }

    const loaded: Loaded = {
      def,
      pivot: new Group(),
      root,
      mixer,
      actions,
      duration,
      edges,
      materials,
      cubes,
      levelOf,
      levelCount,
    };

    // Ukur ruang yang ditempati model, lalu skalakan dan pusatkan di titik asal.
    const box = this.measure(loaded);
    const size = box.getSize(new Vector3());
    const sphere = Math.max(size.length() / 2, 1e-6);
    const scale = RADIUS / sphere;
    const center = box.getCenter(new Vector3());
    loaded.pivot.scale.setScalar(scale);
    loaded.pivot.position.copy(center).multiplyScalar(-scale);
    loaded.pivot.add(root);
    this.applyTime(loaded, 0);
    return loaded;
  }

  /** Kotak pembatas model: posisi awal saja, atau gabungan seluruh animasi. */
  private measure(loaded: Loaded): Box3 {
    const box = new Box3();
    const piece = new Box3();
    const add = (t: number) => {
      this.applyTime(loaded, t);
      loaded.root.updateMatrixWorld(true);
      piece.setFromObject(loaded.root);
      if (!piece.isEmpty()) box.union(piece);
    };
    if (loaded.def.frame === "start" || loaded.duration <= 0) {
      add(0);
    } else {
      const steps = 40;
      for (let i = 0; i <= steps; i++) add((loaded.duration * i) / steps);
    }
    if (box.isEmpty()) box.set(new Vector3(-1, -1, -1), new Vector3(1, 1, 1));
    return box;
  }

  /* ───────── Animasi ───────── */

  get duration() {
    return this.current?.duration ?? 0;
  }

  play() {
    const l = this.current;
    if (!l || l.duration <= 0) return;
    if (this.time >= l.duration - 1e-3) {
      this.time = 0;
      this.applyTime(l, 0);
      this.emitCounts(true);
    }
    this.hold = 0;
    this.playing = true;
    this.emitTime(true);
  }

  pause() {
    this.playing = false;
    this.emitTime(true);
  }

  restart(play = true) {
    const l = this.current;
    if (!l) return;
    this.time = 0;
    this.hold = 0;
    this.applyTime(l, 0);
    this.emitCounts(true);
    this.playing = play && l.duration > 0;
    this.emitTime(true);
    this.dirty = true;
  }

  /** Pindah ke waktu tertentu dan jeda. */
  seek(seconds: number) {
    const l = this.current;
    if (!l) return;
    this.playing = false;
    this.hold = 0;
    this.time = clamp(seconds, 0, l.duration);
    this.applyTime(l, this.time);
    this.emitCounts();
    this.emitTime(true);
    this.dirty = true;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  setLoop(loop: boolean) {
    this.loop = loop;
  }

  private applyTime(l: Loaded, t: number) {
    if (!l.mixer) return;
    // Waktu diatur langsung pada tiap aksi, lalu mixer dievaluasi tanpa kemajuan waktu.
    for (const action of l.actions) action.time = t;
    l.mixer.update(0);
  }

  /* ───────── Tampilan ───────── */

  setEdges(on: boolean) {
    this.showEdges = on;
    if (this.current) this.applyEdges(this.current);
    this.dirty = true;
  }

  setXray(on: boolean) {
    this.xray = on;
    if (this.current) this.applyXray(this.current);
    this.dirty = true;
  }

  setAutoRotate(on: boolean) {
    this.controls.autoRotate = on;
    this.dirty = true;
  }

  /** Tampilkan `count` lapisan pertama dari bawah. */
  setLayers(count: number) {
    this.layerLimit = count;
    if (this.current) {
      this.applyLayers(this.current);
      this.emitCounts(true);
    }
    this.dirty = true;
  }

  private applyEdges(l: Loaded) {
    for (const line of l.edges) line.visible = this.showEdges;
  }

  private applyXray(l: Loaded) {
    for (const rec of l.materials) {
      rec.material.transparent = this.xray ? true : rec.transparent;
      rec.material.opacity = this.xray ? XRAY_OPACITY : rec.opacity;
      rec.material.depthWrite = this.xray ? false : rec.depthWrite;
      rec.material.needsUpdate = true;
    }
  }

  private applyLayers(l: Loaded) {
    if (l.levelCount === 0) return;
    l.cubes.forEach((cube, index) => {
      cube.visible = l.levelOf[index] < this.layerLimit;
    });
  }

  /* ───────── Kamera ───────── */

  resetView() {
    const l = this.current;
    if (!l) return;
    this.userMoved = false;
    this.fitCamera();
  }

  zoomBy(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const length = clamp(offset.length() / factor, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset.setLength(length));
    this.controls.update();
    this.dirty = true;
  }

  private fitCamera() {
    const camera = this.camera;
    const vfov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const distance = (RADIUS / Math.sin(Math.min(vfov, hfov) / 2)) * 1.1;
    this.controls.target.set(0, 0, 0);
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
    this.controls.minDistance = RADIUS * 0.7;
    this.controls.maxDistance = distance * 3;
    this.controls.update();
    this.dirty = true;
  }

  private resize() {
    if (this.disposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width < 2 || height < 2) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // Bila pengguna belum menggeser kamera, bingkai ulang agar model tetap utuh (mis. layar diputar).
    if (this.current && !this.userMoved) this.fitCamera();
    this.dirty = true;
  }

  /* ───────── Pelaporan ke antarmuka ───────── */

  private emitTime(force = false) {
    if (!force && Math.abs(this.time - this.lastEmit) < 1 / 24) return;
    this.lastEmit = this.time;
    this.events.onTime(this.time, this.playing);
  }

  private emitCounts(force = false) {
    const l = this.current;
    if (!l) return;
    const counted = Boolean(l.def.tracker) || l.levelCount > 0;
    if (!counted) {
      // -2 = "tanpa penghitung" sudah dilaporkan.
      if (force || this.lastCount !== -2) this.events.onCounts(null);
      this.lastCount = -2;
      return;
    }
    const value = l.def.tracker
      ? l.cubes.filter((cube) => cube.position.y < AWAY_Y).length
      : l.cubes.filter((cube) => cube.visible).length;
    if (!force && value === this.lastCount) return;
    this.lastCount = value;
    this.events.onCounts({ value, total: l.cubes.length });
  }

  /* ───────── Putaran gambar ───────── */

  private readonly tick = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min((now - (this.lastFrame || now)) / 1000, 0.1);
    this.lastFrame = now;

    const l = this.current;
    if (l && this.playing && l.duration > 0) {
      if (this.hold > 0) {
        this.hold -= dt;
        if (this.hold <= 0) {
          this.time = 0;
          this.applyTime(l, 0);
          this.emitCounts(true);
          this.emitTime(true);
          this.dirty = true;
        }
      } else {
        this.time += dt * this.speed;
        if (this.time >= l.duration) {
          this.time = l.duration;
          if (this.loop) this.hold = LOOP_HOLD;
          else this.playing = false;
          this.emitTime(true);
        } else {
          this.emitTime();
        }
        this.applyTime(l, this.time);
        this.emitCounts();
        this.dirty = true;
      }
    }

    if (this.controls.update(dt)) this.dirty = true;
    if (this.dirty) {
      this.dirty = false;
      this.renderer.render(this.scene, this.camera);
    }
  };

  private readonly onContextLost = (event: Event) => {
    event.preventDefault();
  };

  private readonly onContextRestored = () => {
    this.dirty = true;
  };

  /** Label bacaan layar untuk kanvas. */
  setLabel(label: string) {
    this.renderer.domElement.setAttribute("aria-label", label);
  }

  /* ───────── Pembersihan ───────── */

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("webglcontextlost", this.onContextLost);
    canvas.removeEventListener("webglcontextrestored", this.onContextRestored);

    for (const promise of this.cache.values()) {
      promise
        .then((l) => {
          l.root.traverse((object) => {
            const mesh = object as Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              for (const material of list) material.dispose();
            }
          });
          l.mixer?.stopAllAction();
        })
        .catch(() => undefined);
    }
    this.cache.clear();
    this.edgeMaterial.dispose();
    this.renderer.dispose();
    // Lepas konteks WebGL agar peramban tidak kehabisan konteks saat pengguna berpindah halaman.
    this.renderer.forceContextLoss();
    canvas.remove();
  }
}
