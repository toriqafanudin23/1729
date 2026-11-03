"""Dua model pembuktian volume limas (selain 'kubus menjadi 3 limas').

 1. volume-limas-prisma-3-limas : prisma segitiga dibelah menjadi 3 limas segitiga yang sama besar.
 2. volume-limas-tuang-air      : limas penuh air dituang ke prisma (alas dan tinggi sama), 3 kali tuang.

Jalankan:  python3 gen_limas.py <folder-keluaran> [folder-pratinjau]
"""
from __future__ import annotations

import math
import os
import sys

import numpy as np

from glbkit import (Face, Solid, _Builder, _assemble, _face_mesh, hex_rgba, is_closed)

OUT = sys.argv[1] if len(sys.argv) > 1 else "out"
PREV = sys.argv[2] if len(sys.argv) > 2 else None
os.makedirs(OUT, exist_ok=True)


# ───────────────────────── perakitan glTF umum ─────────────────────────

class Scene:
    """Susunan simpul: tiap simpul punya nama, transformasi awal, anak, dan mesh opsional."""

    def __init__(self) -> None:
        self.b = _Builder()
        self.materials: list[dict] = []
        self.meshes: list[dict] = []
        self.nodes: list[dict] = []
        self.samplers: list[dict] = []
        self.channels: list[dict] = []
        self.roots: list[int] = []
        self._mat: dict[tuple, int] = {}

    def material(self, color: str, alpha: float = 1.0, rough: float = 0.55) -> int:
        key = (color, alpha, rough)
        if key not in self._mat:
            rgba = hex_rgba(color)
            rgba[3] = alpha
            mat = {"name": f"{color}-{alpha}", "doubleSided": True,
                   "pbrMetallicRoughness": {"baseColorFactor": rgba, "metallicFactor": 0.0, "roughnessFactor": rough}}
            if alpha < 1.0:
                mat["alphaMode"] = "BLEND"
            self._mat[key] = len(self.materials)
            self.materials.append(mat)
        return self._mat[key]

    def node(self, name: str, parent: int | None = None, translation=None, scale=None) -> int:
        nd: dict = {"name": name}
        if translation is not None:
            nd["translation"] = [float(v) for v in translation]
        if scale is not None:
            nd["scale"] = [float(v) for v in scale]
        self.nodes.append(nd)
        i = len(self.nodes) - 1
        if parent is None:
            self.roots.append(i)
        else:
            self.nodes[parent].setdefault("children", []).append(i)
        return i

    def face(self, parent: int, name: str, pts: np.ndarray, normal: np.ndarray, mat: int) -> None:
        """Satu poligon cembung sebagai mesh anak dari `parent`. Urutan titik harus berlawanan arah jarum jam
        bila dilihat dari arah normal."""
        p, n, i = _face_mesh(self.b, pts, normal)
        self.meshes.append({"name": name, "primitives": [{"attributes": {"POSITION": p, "NORMAL": n},
                                                          "indices": i, "material": mat, "mode": 4}]})
        self.nodes[parent].setdefault("children", []).append(len(self.nodes))
        self.nodes.append({"name": name, "mesh": len(self.meshes) - 1})

    def solid(self, parent: int, s: Solid, mat: int, prefix: str) -> None:
        for k, f in enumerate(s.faces):
            self.face(parent, f"{prefix}{k}", s.face_pts(f), s.normal(f), mat)

    def animate(self, node: int, path: str, times: list[float], values: list[list[float]]) -> None:
        t = np.array(times, dtype="<f4")
        assert np.all(np.diff(t) > 0), (path, times)
        v = np.array(values, dtype="<f4")
        typ = "VEC3" if v.shape[1] == 3 else "VEC4"
        a_t = self.b.add(t.tobytes(), 5126, len(t), "SCALAR", None, ([t.min()], [t.max()]))
        a_v = self.b.add(v.tobytes(), 5126, len(v), typ)
        self.samplers.append({"input": a_t, "output": a_v, "interpolation": "LINEAR"})
        self.channels.append({"sampler": len(self.samplers) - 1, "target": {"node": node, "path": path}})

    def glb(self) -> bytes:
        doc = {"scene": 0, "scenes": [{"nodes": self.roots}], "nodes": self.nodes, "meshes": self.meshes,
               "materials": self.materials}
        if self.samplers:
            doc["animations"] = [{"name": "Animasi", "samplers": self.samplers, "channels": self.channels}]
        return _assemble(self.b, doc)


def ease(x: float) -> float:
    return x * x * (3 - 2 * x)


# ───────────────────────── 1. prisma → 3 limas ─────────────────────────

def tetra(verts: np.ndarray) -> Solid:
    f = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]
    s = Solid(np.array(verts, dtype=float), [Face(i, "#000000", f"s{k}") for k, i in enumerate(f)])
    s.orient_outward()
    assert is_closed(s)
    return s


def prisma_tiga_limas() -> bytes:
    h = 2.3
    A, B, C = np.array([0, 0, 0.0]), np.array([2.4, 0, 0.0]), np.array([0.7, 0, 1.7])
    up = np.array([0, h, 0.0])
    D, E, F = A + up, B + up, C + up
    # T1 = ABCE (biru), T2 = EACD (oranye), T3 = ECFD (hijau)
    pieces = [("limas_biru", [A, B, C, E], "#3b82f6"),
              ("limas_oranye", [E, A, C, D], "#f59e0b"),
              ("limas_hijau", [E, C, F, D], "#22b455")]
    solids = [tetra(np.array(v)) for _, v, _ in pieces]
    vol = [s.volume() for s in solids]
    area = 0.5 * np.linalg.norm(np.cross(B - A, C - A))
    assert all(abs(v - area * h / 3) < 1e-9 for v in vol), vol  # ketiganya persis 1/3 prisma
    center = np.mean([A, B, C, D, E, F], axis=0)

    sc = Scene()
    times = [0.0, 1.4, 3.8, 6.4]
    moves = []
    for (name, v, color), s in zip(pieces, solids):
        d = s.centroid() - center
        d = d / np.linalg.norm(d)
        moves.append(d)
    # arah pisah: sepanjang vektor dari pusat prisma ke pusat limas, cukup jauh agar ketiganya terpisah
    scale = 1.55
    for (name, v, color), s in zip(pieces, solids):
        node = sc.node(name)
        sc.solid(node, s, sc.material(color), name[:3])
        off = (s.centroid() - center) * scale
        n = 8
        ts, vs = [0.0, 1.4], [[0, 0, 0], [0, 0, 0]]
        for k in range(1, n + 1):
            e = ease(k / n)
            ts.append(1.4 + 2.4 * k / n)
            vs.append([float(x) for x in off * e])
        ts.append(6.4)
        vs.append([float(x) for x in off])
        sc.animate(node, "translation", ts, vs)
        sc.nodes[node]["translation"] = [0.0, 0.0, 0.0]
    # periksa tidak ada limas yang saling menembus setelah terpisah (jarak titik terdekat)
    moved = [s.verts + (s.centroid() - center) * scale for s in solids]
    gap = min(np.linalg.norm(a[:, None] - b[None], axis=-1).min() for i, a in enumerate(moved) for b in moved[i + 1:])
    print(f"prisma-3-limas: volume tiap limas {vol[0]:.4f}/{vol[1]:.4f}/{vol[2]:.4f}, prisma {area*h:.4f}, jarak antar limas {gap:.3f}")
    assert gap > 0.15
    return sc.glb(), solids, center, scale


# ───────────────────────── 2. limas dituang ke prisma ─────────────────────────

def tuang_air() -> bytes:
    a = 1.0          # setengah sisi alas (persegi 2a x 2a)
    h = 2.4          # tinggi kedua wadah
    k = 0.955        # air sedikit lebih kecil dari kaca agar tidak berimpit
    px, qx = -2.0, 2.0   # pusat limas (apex di bawah) dan pusat prisma
    GLASS, WATER = "#8fb4dc", "#2b8de6"
    sc = Scene()
    glass = sc.material(GLASS, 0.22, 0.2)
    water = sc.material(WATER, 1.0, 0.25)

    def quad(parent, name, pts, mat, inside):
        """Poligon dengan normal mengarah keluar (menjauhi titik `inside`)."""
        pts = np.array(pts, dtype=float)
        n = np.cross(pts[1] - pts[0], pts[2] - pts[0])
        n /= np.linalg.norm(n)
        if np.dot(n, pts.mean(axis=0) - np.array(inside, dtype=float)) < 0:
            pts, n = pts[::-1], -n
        sc.face(parent, name, pts, n, mat)

    # kaca limas (ujung di bawah, mulut terbuka di atas)
    g1 = sc.node("kaca_limas")
    apex = np.array([px, 0.0, 0.0])
    rim = [np.array([px + sx * a, h, sz * a]) for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    for i in range(4):
        quad(g1, f"limas{i}", [apex, rim[i], rim[(i + 1) % 4]], glass, [px, 0.75 * h, 0])
    # kaca prisma (tanpa tutup)
    g2 = sc.node("kaca_prisma")
    bot = [np.array([qx + sx * a, 0.0, sz * a]) for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    top = [p + np.array([0, h, 0]) for p in bot]
    quad(g2, "alas", [bot[0], bot[3], bot[2], bot[1]], glass, [qx, h / 2, 0])
    for i in range(4):
        j = (i + 1) % 4
        quad(g2, f"sisi{i}", [bot[i], bot[j], top[j], top[i]], glass, [qx, h / 2, 0])

    # air dalam limas: simpul berporos di ujung limas, diskalakan seragam
    w1 = sc.node("air_limas", translation=[px, 0.0, 0.0], scale=[1, 1, 1])
    ap = np.zeros(3)
    wr = [np.array([sx * a * k, h, sz * a * k]) for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    for i in range(4):
        quad(w1, f"a{i}", [ap, wr[i], wr[(i + 1) % 4]], water, [0, 0.75 * h, 0])
    quad(w1, "permukaan", [wr[0], wr[3], wr[2], wr[1]], water, [0, 0.75 * h, 0])
    # air dalam prisma: tinggi satuan, diskalakan pada sumbu y
    w2 = sc.node("air_prisma", translation=[qx, 0.0, 0.0], scale=[1, 1e-3, 1])
    b2 = [np.array([sx * a * k, 0.0, sz * a * k]) for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    t2 = [p + np.array([0, 1.0, 0]) for p in b2]
    quad(w2, "dasar", [b2[0], b2[3], b2[2], b2[1]], water, [0, 0.5, 0])
    quad(w2, "permukaan", [t2[0], t2[1], t2[2], t2[3]], water, [0, 0.5, 0])
    for i in range(4):
        j = (i + 1) % 4
        quad(w2, f"s{i}", [b2[i], b2[j], t2[j], t2[i]], water, [0, 0.5, 0])

    # garis waktu
    hold0, pour, gap, refill, hold1 = 1.0, 2.0, 0.3, 0.8, 1.5
    eps = 1e-3
    # air prisma: mengecil di semua sumbu selama belum ada air (tanpa "genangan" di dasar)
    ts_s, vs_s, ts_h, vs_h = [0.0], [[1, 1, 1]], [0.0], [[eps, eps, eps]]
    t = hold0
    ts_s.append(t); vs_s.append([1, 1, 1]); ts_h.append(t); vs_h.append([eps, eps, eps])
    H = 0.0
    n = 14
    for tuang in range(3):
        # tuang dengan debit tetap: volume tersisa di limas = s^3
        for i in range(1, n + 1):
            tau = i / n
            s = max((1 - tau) ** (1 / 3), eps)
            tt = t + pour * tau
            ts_s.append(tt); vs_s.append([s, s, s])
            ts_h.append(tt); vs_h.append([1, max(H + (h / 3) * tau, eps), 1])
            if tuang == 0 and i == 1:
                vs_h[-1] = [1, max(H + (h / 3) * tau, eps), 1]
        t += pour
        H += h / 3
        if tuang < 2:
            t += gap
            ts_s.append(t); vs_s.append([eps, eps, eps]); ts_h.append(t); vs_h.append([1, H, 1])
            for i in range(1, 7):
                x = ease(i / 6)
                ts_s.append(t + refill * i / 6); vs_s.append([max(x, eps)] * 3)
                ts_h.append(t + refill * i / 6); vs_h.append([1, H, 1])
            t += refill + gap
            ts_s.append(t); vs_s.append([1, 1, 1]); ts_h.append(t); vs_h.append([1, H, 1])
    t += hold1
    ts_s.append(t); vs_s.append([eps, eps, eps]); ts_h.append(t); vs_h.append([1, h, 1])
    sc.animate(w1, "scale", ts_s, vs_s)
    sc.animate(w2, "scale", ts_h, vs_h)
    assert abs(H - h) < 1e-9
    print(f"tuang-air: durasi {t:.2f} dtk, air prisma akhir {H:.3f} dari {h}")
    return sc.glb()


# ───────────────────────── keluaran ─────────────────────────

if __name__ == "__main__":
    glb, solids, center, scale = prisma_tiga_limas()
    open(os.path.join(OUT, "volume-limas-prisma-3-limas.glb"), "wb").write(glb)
    open(os.path.join(OUT, "volume-limas-tuang-air.glb"), "wb").write(tuang_air())
    print("selesai ->", OUT)
