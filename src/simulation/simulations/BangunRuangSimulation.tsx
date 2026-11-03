import {
  Box,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Rotate3d,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SimSection, SimSlider, SimToggle } from "../common/components/SimControls";
import { SimMath } from "../common/components/SimMath";
import { SimulationShell } from "../common/components/SimulationShell";
import { useStoredSimulationState } from "../common/hooks/useStoredSimulationState";
import {
  DEFAULT_MODEL_ID,
  GROUPS,
  MODELS,
  findModel,
  modelsOf,
  type GroupId,
} from "../math/bangunRuangData";
import { SolidStage, type StageCounts } from "../three/SolidStage";
import "./BangunRuangSimulation.css";

/* Simulasi Bangun Ruang Sisi Datar (three.js).
   Model .glb dari public/models/bangun-ruang dimuat sesuai pilihan di panel.
   Pengguna dapat memutar, memperbesar, dan menggeser model; animasi bawaan
   file dapat diputar, dijeda, diulang, dan digeser waktunya.
   Mesin 3D ada di ../three/SolidStage.ts; berkas ini hanya antarmuka. */

type View = {
  model: string;
  edges: boolean;
  xray: boolean;
  spin: boolean;
  speed: number;
  loop: boolean;
};

const initialView: View = {
  model: DEFAULT_MODEL_ID,
  edges: true,
  xray: false,
  spin: false,
  speed: 1,
  loop: false,
};

const SPEEDS = [0.5, 1, 2];
const ZOOM_STEP = 1.25;

type Status = "loading" | "ready" | "error" | "unsupported";

const fmtTime = (seconds: number) => seconds.toFixed(1).replace(".", ",");
const fmtSpeed = (speed: number) => `${String(speed).replace(".", ",")}×`;

const icon = (Icon: LucideIcon) => <Icon size={17} aria-hidden="true" />;

export function BangunRuangSimulation() {
  const [stored, setStored] = useStoredSimulationState<View>("bangun-ruang", initialView);
  const model = findModel(stored.model) ?? MODELS[0];
  const view: View = { ...stored, model: model.id };

  const mountRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<SolidStage | null>(null);
  const prefetched = useRef(false);

  const [status, setStatus] = useState<Status>("loading");
  const [retry, setRetry] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [counts, setCounts] = useState<StageCounts | null>(null);
  const [layerCount, setLayerCount] = useState(0);
  const [layers, setLayers] = useState(0);
  const [hint, setHint] = useState(true);

  const updateView = (patch: Partial<View>) => setStored({ ...view, ...patch });

  // Petunjuk gerakan hilang sendiri setelah beberapa detik.
  useEffect(() => {
    if (status !== "ready" || !hint) return;
    const timer = window.setTimeout(() => setHint(false), 9000);
    return () => window.clearTimeout(timer);
  }, [status, hint]);

  /* ───────── Panggung 3D: dibuat sekali, dibersihkan saat ditutup ───────── */

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let stage: SolidStage;
    try {
      stage = new SolidStage(mount, {
        onTime: (t, isPlaying) => {
          setTime(t);
          setPlaying(isPlaying);
        },
        onCounts: setCounts,
        onInteract: () => setHint(false),
      });
    } catch {
      setStatus("unsupported");
      return;
    }
    stageRef.current = stage;
    return () => {
      stage.dispose();
      stageRef.current = null;
      prefetched.current = false;
    };
  }, []);

  /* ───────── Tampilan yang dipilih pengguna ───────── */

  useEffect(() => {
    stageRef.current?.setEdges(view.edges);
  }, [view.edges]);
  useEffect(() => {
    stageRef.current?.setXray(view.xray);
  }, [view.xray]);
  useEffect(() => {
    stageRef.current?.setAutoRotate(view.spin);
  }, [view.spin]);
  useEffect(() => {
    stageRef.current?.setSpeed(view.speed);
  }, [view.speed]);
  useEffect(() => {
    stageRef.current?.setLoop(view.loop);
  }, [view.loop]);

  /* ───────── Memuat model yang dipilih ───────── */

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    setStatus("loading");
    setTime(0);
    setPlaying(false);
    setCounts(null);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    stage
      .show(model, !reduceMotion)
      .then((info) => {
        if (cancelled) return;
        setDuration(info.duration);
        setLayerCount(info.layerCount);
        setLayers(info.layerCount);
        setStatus("ready");
        stage.setLabel(`${model.title}. Model 3D interaktif: geser untuk memutar, cubit untuk memperbesar.`);
        // Unduh model lain di latar belakang (kecuali pengguna menghemat kuota).
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (!prefetched.current && !connection?.saveData) {
          prefetched.current = true;
          void stage.prefetch(MODELS.filter((m) => m.id !== model.id));
        }
      })
      .catch((error: unknown) => {
        if (cancelled || (error instanceof Error && error.message === "dibatalkan")) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [model, retry]);

  useEffect(() => {
    if (status === "ready" && layerCount > 0) stageRef.current?.setLayers(layers);
  }, [layers, layerCount, status]);

  /* ───────── Aksi ───────── */

  const selectModel = (id: string) => {
    if (id !== model.id) updateView({ model: id });
  };
  const selectGroup = (group: GroupId) => {
    if (group !== model.group) updateView({ model: modelsOf(group)[0].id });
  };
  const step = (direction: 1 | -1) => {
    const index = MODELS.findIndex((m) => m.id === model.id);
    selectModel(MODELS[(index + direction + MODELS.length) % MODELS.length].id);
  };

  const togglePlay = () => {
    const stage = stageRef.current;
    if (!stage) return;
    if (playing) stage.pause();
    else stage.play();
  };
  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(view.speed) + 1) % SPEEDS.length] ?? 1;
    updateView({ speed: next });
  };

  const resetAll = () => {
    const stage = stageRef.current;
    updateView({ edges: true, xray: false, spin: false, speed: 1, loop: false });
    setLayers(layerCount);
    stage?.resetView();
    stage?.restart(false);
  };

  /* ───────── Tampilan ───────── */

  const group = GROUPS.find((g) => g.id === model.group) ?? GROUPS[0];
  const finished = duration > 0 && time >= duration - 1e-3 && !playing;
  const seekStyle = { "--sim-fill": `${duration > 0 ? (time / duration) * 100 : 0}%` } as CSSProperties;

  const counter =
    counts && model.tracker
      ? `Tersisa ${counts.value} dari ${counts.total} kubus`
      : counts && model.layers
        ? `Tampak ${counts.value} kubus`
        : null;

  const panel = (
    <>
      <SimSection title="Pilih simulasi">
        <ul className="br-groups">
          {GROUPS.map((g) => {
            const active = g.id === model.group;
            const items = modelsOf(g.id);
            return (
              <li key={g.id} className={`br-group${active ? " is-active" : ""}`}>
                <button
                  type="button"
                  className="br-group__btn"
                  aria-pressed={active}
                  onClick={() => selectGroup(g.id)}
                >
                  <span className="br-group__name">{g.label}</span>
                  <span className="br-group__hint">{g.hint}</span>
                </button>
                {active && items.length > 1 && (
                  <div className="sim-seg br-group__models" role="radiogroup" aria-label={`Model ${g.label}`}>
                    {items.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={m.id === model.id}
                        className="sim-seg__btn"
                        onClick={() => selectModel(m.id)}
                      >
                        {m.short}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </SimSection>

      {layerCount > 0 && (
        <SimSection title="Lapisan">
          <SimSlider
            id="br-layers"
            name="lapisan yang ditampilkan"
            label={`Lapisan: ${layers} dari ${layerCount}`}
            hint="dihitung dari bawah"
            value={layers}
            min={0}
            max={layerCount}
            step={1}
            onChange={setLayers}
          />
          {counter && <p className="br-counter">{counter}</p>}
        </SimSection>
      )}

      <SimSection title={model.title}>
        <p className="br-text">{model.info.text}</p>
        {model.info.facts && (
          <dl className="br-facts">
            {model.info.facts.map(([label, value]) => (
              <div key={label} className="br-facts__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {model.info.formulas && (
          <ul className="br-formulas">
            {model.info.formulas.map((tex) => (
              <li key={tex}>
                <SimMath tex={tex} />
              </li>
            ))}
          </ul>
        )}
      </SimSection>
    </>
  );

  return (
    <SimulationShell
      title="Simulasi Bangun Ruang Sisi Datar"
      onReset={resetAll}
      onZoomIn={() => stageRef.current?.zoomBy(ZOOM_STEP)}
      onZoomOut={() => stageRef.current?.zoomBy(1 / ZOOM_STEP)}
      onHome={() => stageRef.current?.resetView()}
      toggles={
        <>
          <SimToggle
            icon={icon(Box)}
            label="Garis rusuk"
            pressed={view.edges}
            onClick={() => updateView({ edges: !view.edges })}
          />
          <SimToggle
            icon={icon(Eye)}
            label="Tembus pandang"
            pressed={view.xray}
            onClick={() => updateView({ xray: !view.xray })}
          />
          <SimToggle
            icon={icon(Rotate3d)}
            label="Putar otomatis"
            pressed={view.spin}
            onClick={() => updateView({ spin: !view.spin })}
          />
          {duration > 0 && (
            <SimToggle
              icon={icon(Repeat)}
              label="Ulangi"
              pressed={view.loop}
              onClick={() => updateView({ loop: !view.loop })}
            />
          )}
        </>
      }
      panel={panel}
      notes={
        <>
          <p>Geser (satu jari / klik kiri) untuk memutar model. Cubit atau gulir untuk memperbesar dan memperkecil.</p>
          <p>Geser dengan dua jari (atau klik kanan) untuk memindahkan model. Tombol rumah mengembalikan tampilan.</p>
          <p>Aktifkan “Tembus pandang” untuk melihat bagian dalam, dan “Garis rusuk” untuk memperjelas rusuk.</p>
        </>
      }
      graph={
        <div className="br-stage">
          <div ref={mountRef} className="br-canvas" />

          <div className="br-top">
            <button type="button" className="br-nav" aria-label="Model sebelumnya" onClick={() => step(-1)}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div className="br-title" aria-live="polite">
              <span className="br-title__group">{group.label}</span>
              <strong className="br-title__name">{model.title}</strong>
              {counter && <span className="br-title__count">{counter}</span>}
            </div>
            <button type="button" className="br-nav" aria-label="Model berikutnya" onClick={() => step(1)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          {status === "loading" && (
            <div className="br-status" role="status">
              <span className="br-spinner" aria-hidden="true" />
              Memuat model 3D…
            </div>
          )}
          {status === "error" && (
            <div className="br-status br-status--error" role="alert">
              <p>Model tidak dapat dimuat. Periksa koneksi internet, lalu coba lagi.</p>
              <button type="button" className="sim-text-btn" onClick={() => setRetry((n) => n + 1)}>
                Coba lagi
              </button>
            </div>
          )}
          {status === "unsupported" && (
            <div className="br-status br-status--error" role="alert">
              <p>Peramban ini tidak mendukung grafik 3D (WebGL). Coba perbarui peramban atau gunakan perangkat lain.</p>
            </div>
          )}

          {hint && status === "ready" && (
            <p className={`br-hint${duration > 0 ? " br-hint--lifted" : ""}`}>
              Geser untuk memutar · cubit untuk zoom · dua jari untuk menggeser
            </p>
          )}

          {duration > 0 && status === "ready" && (
            <div className="br-transport" role="group" aria-label="Kontrol animasi">
              <button
                type="button"
                className="br-tbtn"
                aria-label="Ulangi dari awal"
                title="Ulangi dari awal"
                onClick={() => stageRef.current?.restart(false)}
              >
                <RotateCcw size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="br-tbtn br-tbtn--primary"
                aria-label={playing ? "Jeda" : finished ? "Putar ulang" : "Putar"}
                title={playing ? "Jeda" : finished ? "Putar ulang" : "Putar"}
                onClick={togglePlay}
              >
                {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              </button>
              <input
                className="sim-range br-seek"
                style={seekStyle}
                type="range"
                min={0}
                max={duration}
                step={0.01}
                value={Math.min(time, duration)}
                aria-label="Posisi animasi"
                aria-valuetext={`${fmtTime(time)} dari ${fmtTime(duration)} detik`}
                onChange={(event) => stageRef.current?.seek(Number(event.currentTarget.value))}
              />
              <span className="br-time" aria-hidden="true">
                {fmtTime(time)} / {fmtTime(duration)} dtk
              </span>
              <button
                type="button"
                className="br-tbtn br-tbtn--text"
                aria-label={`Kecepatan ${fmtSpeed(view.speed)}. Tekan untuk mengganti.`}
                title="Ganti kecepatan"
                onClick={cycleSpeed}
              >
                {fmtSpeed(view.speed)}
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
