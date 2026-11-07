import { useEffect, useRef, useState } from "react";
import { useJsxBoard, type SimBoard } from "../../simulation/common/hooks/useJsxBoard";
import { IconPause, IconPlay } from "../components/icons";
import { addFunction, addGridAxes, addMarker, addSegment, COLORS } from "./jxg";
import { LabBoard, LabFrame, LabSlider, Readout } from "./LabKit";
import { num, tex } from "./format";

/* Lintasan bola: h(t) = 20t − 5t² (h dalam meter, t dalam detik). */

const T_MAX = 4;
const h = (t: number) => 20 * t - 5 * t * t;

export function BallLab() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(t);
  tRef.current = t;

  const setup = (board: SimBoard) => {
    addGridAxes(board, { x: "t", y: "h" });
    addFunction(board, h, { domain: [0, T_MAX] });
    addSegment(board, () => [tRef.current, 0], () => [tRef.current, h(tRef.current)], { color: COLORS.muted });
    addSegment(board, () => [0, h(tRef.current)], () => [tRef.current, h(tRef.current)], { color: COLORS.muted });
    addMarker(board, () => tRef.current, () => h(tRef.current), {
      color: COLORS.accent,
      size: 7,
      label: (x, y) => `(${num(x)}; ${num(y)})`,
    });
  };

  const { boardProps, boardRef } = useJsxBoard({
    boundingBox: [-0.7, 25, 5.3, -4],
    setup,
    zoomRange: [1, 1],
    keepAspectRatio: false,
    embedded: true,
  });

  useEffect(() => {
    boardRef.current?.update();
  }, [t, boardRef]);

  // Animasi: dijalankan siswa lewat tombol Putar.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      // Cap waktu frame pertama menjadi acuan; performance.now() bisa lebih besar dari cap waktu frame.
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      const next = Math.min(T_MAX, tRef.current + dt * 0.8);
      tRef.current = next;
      setT(next);
      if (next >= T_MAX) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const height = h(t);
  const ballY = 190 - (Math.max(0, height) / 22) * 170;

  return (
    <LabFrame
      title="Simulasi 1.1 · Lintasan bola"
      hint="Geser waktu atau tekan Putar. Titik pada grafik adalah bola; garis putus-putus menunjukkan waktu dan tingginya."
      onReset={() => {
        setPlaying(false);
        setT(0);
      }}
      stage={<LabBoard boardProps={boardProps} label="Grafik tinggi bola terhadap waktu, berbentuk parabola membuka ke bawah" />}
      controls={
        <>
          <div className="mt-lab__ballrow">
            <svg className="mt-ball" viewBox="0 0 90 210" role="img" aria-label={`Bola pada ketinggian ${num(height)} meter`}>
              <line x1="8" y1="190" x2="82" y2="190" stroke="#9c9a92" strokeWidth="2" />
              {[5, 10, 15, 20].map((m) => (
                <g key={m}>
                  <line x1="8" x2="14" y1={190 - (m / 22) * 170} y2={190 - (m / 22) * 170} stroke="#d6d4c9" />
                  <text x="18" y={194 - (m / 22) * 170} fontSize="9" fill="#73726c">
                    {m} m
                  </text>
                </g>
              ))}
              <ellipse cx="55" cy="190" rx={10 - Math.min(5, height / 5)} ry="2.5" fill="#d6d4c9" />
              <circle cx="55" cy={ballY - 9} r="9" fill={COLORS.accent} stroke="#fff" strokeWidth="1.5" />
            </svg>
            <button type="button" className="mt-btn mt-btn--primary" onClick={() => {
                if (t >= T_MAX) {
                  setT(0);
                  setPlaying(true);
                } else setPlaying((p) => !p);
              }}>
              {playing ? <IconPause size={16} /> : <IconPlay size={16} />} {playing ? "Jeda" : "Putar"}
            </button>
          </div>
          <LabSlider
            symbol="t"
            name="waktu dalam detik"
            value={Math.round(t * 100) / 100}
            min={0}
            max={T_MAX}
            step={0.25}
            color={COLORS.accent}
            onChange={(v) => {
              setPlaying(false);
              setT(v);
            }}
          />
        </>
      }
      readout={
        <Readout
          items={[
            { label: "Rumus", tex: "h(t)=20t-5t^{2}", wide: true },
            { label: "Waktu", tex: `t=${tex(t)}\\ \\text{detik}` },
            { label: "Tinggi bola", tex: `h=${tex(height)}\\ \\text{m}` },
          ]}
        />
      }
    />
  );
}
