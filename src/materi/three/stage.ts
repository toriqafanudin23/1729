import {
  Color,
  DirectionalLight,
  HemisphereLight,
  MOUSE,
  Object3D,
  PerspectiveCamera,
  Scene,
  TOUCH,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Mesh,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/* ------------------------------------------------------------------ *
 *  Panggung 3D untuk simulasi di dalam Materi (tanpa React).
 *
 *  - Render hanya bila ada perubahan dan hanya saat terlihat di layar.
 *  - Satu jari menggeser mendatar = memutar; geser tegak tetap menggulir
 *    halaman (touch-action: pan-y). Sudut pandang lain lewat tombol.
 *  - Arah pandang dan zoom pengguna dipertahankan saat ukuran benda berubah.
 * ------------------------------------------------------------------ */

export type ViewPreset = "serong" | "depan" | "atas" | "samping";

const PRESETS: Record<ViewPreset, [number, number, number]> = {
  serong: [0.85, 0.7, 1],
  depan: [0, 0.12, 1],
  atas: [0, 1, 0.0001],
  samping: [1, 0.12, 0],
};

const FOV = 36;

export function disposeObject(root: Object3D) {
  root.traverse((object) => {
    const mesh = object as Mesh;
    const geometry = mesh.geometry as BufferGeometry | undefined;
    geometry?.dispose();
    const material = mesh.material as Material | Material[] | undefined;
    if (material) (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
  });
}

export class Stage {
  readonly scene = new Scene();
  readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  private readonly container: HTMLElement;
  private readonly renderer: WebGLRenderer;
  private readonly controls: OrbitControls;
  private readonly resizeObserver: ResizeObserver;
  private readonly visibility: IntersectionObserver;

  private raf = 0;
  private last = 0;
  private dirty = true;
  private visible = true;
  private disposed = false;

  private radius = 3;
  private fitDistance = 10;
  private zoom = 1;
  private readonly viewDir = new Vector3(...PRESETS.serong).normalize();
  private readonly target = new Vector3();

  constructor(container: HTMLElement) {
    this.container = container;
    // Bila WebGL tidak tersedia, konstruktor melempar galat; pemanggil menampilkan pesan.
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(new Color(0xffffff), 1);
    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.setAttribute("role", "img");
    container.appendChild(canvas);

    this.scene.add(new HemisphereLight(0xffffff, 0xc7cedb, 1.55));
    const head = new DirectionalLight(0xffffff, 1.7);
    head.position.set(0.5, 1, 0.8);
    this.camera.add(head);
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.9;
    this.controls.enablePan = false;
    this.controls.enableZoom = false; // zoom lewat tombol: roda mouse tetap menggulir halaman
    this.controls.autoRotateSpeed = 2;
    this.controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.ROTATE };
    this.controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    // OrbitControls memasang touch-action:none; kembalikan agar geser tegak menggulir halaman.
    canvas.style.touchAction = "pan-y";
    this.controls.addEventListener("change", () => {
      const offset = this.camera.position.clone().sub(this.target);
      const dist = offset.length();
      if (dist > 1e-6) {
        this.viewDir.copy(offset).divideScalar(dist);
        this.zoom = dist / this.fitDistance;
      }
      this.dirty = true;
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.visibility = new IntersectionObserver(
      (entries) => {
        this.visible = entries.some((e) => e.isIntersecting);
        if (this.visible) this.dirty = true;
      },
      { rootMargin: "120px" },
    );
    this.visibility.observe(container);

    this.resize();
    this.raf = requestAnimationFrame(this.tick);
  }

  add(object: Object3D) {
    this.scene.add(object);
    this.dirty = true;
  }

  remove(object: Object3D) {
    this.scene.remove(object);
    this.dirty = true;
  }

  render() {
    this.dirty = true;
  }

  setLabel(label: string) {
    this.renderer.domElement.setAttribute("aria-label", label);
  }

  /** Membingkai benda berjari-jari `radius` yang berpusat di titik asal. */
  frame(radius: number) {
    this.radius = Math.max(radius, 0.01);
    this.applyCamera();
  }

  setView(preset: ViewPreset) {
    this.viewDir.set(...PRESETS[preset]).normalize();
    this.applyCamera();
  }

  zoomBy(factor: number) {
    this.zoom = Math.min(2.6, Math.max(0.45, this.zoom / factor));
    this.applyCamera();
  }

  setAutoRotate(on: boolean) {
    this.controls.autoRotate = on;
    this.dirty = true;
  }

  private applyCamera() {
    const vfov = (FOV * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    this.fitDistance = (this.radius / Math.sin(Math.min(vfov, hfov) / 2)) * 1.08;
    this.controls.target.copy(this.target);
    this.camera.position.copy(this.viewDir).multiplyScalar(this.fitDistance * this.zoom).add(this.target);
    this.camera.lookAt(this.target);
    this.controls.minDistance = this.fitDistance * 0.45;
    this.controls.maxDistance = this.fitDistance * 2.6;
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
    this.applyCamera();
  }

  private readonly tick = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min((now - (this.last || now)) / 1000, 0.1);
    this.last = now;
    if (!this.visible) return;
    if (this.controls.update(dt)) this.dirty = true;
    if (this.dirty) {
      this.dirty = false;
      this.renderer.render(this.scene, this.camera);
    }
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.visibility.disconnect();
    this.controls.dispose();
    disposeObject(this.scene);
    const canvas = this.renderer.domElement;
    this.renderer.dispose();
    // Lepas konteks WebGL agar peramban tidak kehabisan konteks saat pembaca berpindah bab.
    this.renderer.forceContextLoss();
    canvas.remove();
  }
}
