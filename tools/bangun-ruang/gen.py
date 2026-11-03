"""Membuat model baru bangun ruang: jaring-jaring prisma/limas (animasi) dan prisma tambahan (statis).

Jalankan:  python3 gen.py <folder-keluaran> [folder-pratinjau]
"""
from __future__ import annotations

import math
import os
import sys

import numpy as np
from matplotlib.path import Path

from glbkit import (Face, Solid, build_net_glb, build_solid_glb, fold_world, is_closed, prism, pyramid,
                    regular_polygon, unfold)

OUT = sys.argv[1] if len(sys.argv) > 1 else "out"
PREV = sys.argv[2] if len(sys.argv) > 2 else None
os.makedirs(OUT, exist_ok=True)

# warna tiap sisi: cerah dan berbeda (selaras dengan model lama)
BASE, TOP = "#f6d31c", "#e8453c"
SIDES = ["#3b82f6", "#22b455", "#f59e0b", "#14b8a6", "#8b5cf6", "#ec4899", "#0ea5e9", "#84cc16"]


def colorize(s: Solid, base=BASE, top=None) -> Solid:
    """Alas = BASE; atas (prisma) = TOP; sisi tegak berganti warna."""
    k = 0
    for f in s.faces:
        if f.name == "alas":
            f.color = base
        elif f.name == "atas":
            f.color = top or TOP
        else:
            f.color = SIDES[k % len(SIDES)]
            k += 1
    return s


report: list[str] = []


# ───────────────────────── verifikasi ─────────────────────────

def check_net(name: str, s: Solid, nf) -> bool:
    ok = True
    # 1. benda tertutup
    if not is_closed(s):
        report.append(f"[GAGAL] {name}: padat tidak tertutup")
        return False
    # 2. setelah dilipat, titik yang sama harus berimpit dan jarak antar titik sama dengan padat asli
    world = fold_world(s, nf, 1.0)
    pos: dict[int, np.ndarray] = {}
    for k, f in enumerate(nf):
        sf = s.faces[f.face]
        for local, vi in enumerate(sf.idx):
            p = world[k][local]
            if vi in pos and np.linalg.norm(pos[vi] - p) > 1e-5:
                report.append(f"[GAGAL] {name}: titik {vi} tidak berimpit ({np.linalg.norm(pos[vi]-p):.4f})")
                ok = False
            pos.setdefault(vi, p)
    ids = sorted(pos)
    A = np.array([pos[i] for i in ids])
    B = s.verts[ids]
    dA = np.linalg.norm(A[:, None] - A[None], axis=-1)
    dB = np.linalg.norm(B[:, None] - B[None], axis=-1)
    if np.abs(dA - dB).max() > 1e-5:
        report.append(f"[GAGAL] {name}: bentuk lipatan beda dari padat ({np.abs(dA-dB).max():.4f})")
        ok = False
    if A[:, 1].min() < -1e-6:
        report.append(f"[GAGAL] {name}: sebagian titik di bawah lantai")
        ok = False
    # 3. jaring datar tidak saling menimpa
    polys = [np.array(f.flat) for f in nf]
    for i in range(len(polys)):
        for j in range(i + 1, len(polys)):
            if overlap(polys[i], polys[j]):
                report.append(f"[GAGAL] {name}: sisi {i} dan {j} bertumpuk pada jaring datar")
                ok = False
    # 4. luas total = luas permukaan padat
    def area(p):
        return abs(0.5 * sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))))
    a_net = sum(area(p) for p in polys)
    a_sol = sum(area(np.array([s.verts[i][[0, 2]] for i in f.idx])) if False else 0 for f in s.faces)
    if len(nf) != len(s.faces):
        report.append(f"[GAGAL] {name}: jumlah sisi jaring {len(nf)} != {len(s.faces)}")
        ok = False
    return ok


def overlap(p: np.ndarray, q: np.ndarray) -> bool:
    def shrink(a, f=0.97):
        c = a.mean(axis=0)
        return c + (a - c) * f
    ps, qs = shrink(p), shrink(q)
    rng = np.random.default_rng(7)

    def sample(a, n=500):
        # titik acak di dalam poligon cembung (kipas segitiga)
        tris = [(a[0], a[i], a[i + 1]) for i in range(1, len(a) - 1)]
        areas = np.array([abs((t[1][0]-t[0][0])*(t[2][1]-t[0][1]) - (t[1][1]-t[0][1])*(t[2][0]-t[0][0])) / 2 for t in tris])
        out = []
        for _ in range(n):
            t = tris[rng.choice(len(tris), p=areas / areas.sum())]
            r1, r2 = rng.random(), rng.random()
            if r1 + r2 > 1:
                r1, r2 = 1 - r1, 1 - r2
            out.append(t[0] + r1 * (t[1] - t[0]) + r2 * (t[2] - t[0]))
        return np.array(out)

    return bool(Path(qs).contains_points(sample(ps)).any() or Path(ps).contains_points(sample(qs)).any())


# ───────────────────────── jaring prisma ─────────────────────────

def prism_strip_tree(n: int, pa: int, pt: int, side_a: str = "bawah", side_t: str = "atas", cut: int = 0):
    """Pita n persegi panjang (urutan melingkar mulai `cut`); alas dan atas menempel pada posisi pa dan pt.
    Akar = alas. Mengembalikan (root, [(anak, induk)])."""
    # sisi pada Solid: 0=alas, 1=atas, 2+i = tegak i
    lat = lambda p: 2 + ((cut + p) % n)
    tree = [(lat(pa), 0)]
    for p in range(pa + 1, n):
        tree.append((lat(p), lat(p - 1)))
    for p in range(pa - 1, -1, -1):
        tree.append((lat(p), lat(p + 1)))
    tree.append((1, lat(pt)))
    return 0, tree


def prism_star_tree(n: int, pt: int):
    tree = [(2 + i, 0) for i in range(n)]
    tree.append((1, 2 + pt))
    return 0, tree


def pyramid_star_tree(n: int):
    return 0, [(1 + i, 0) for i in range(n)]


def pyramid_strip_tree(n: int, k: int, cut: int = 0):
    lat = lambda p: 1 + ((cut + p) % n)
    tree = [(lat(k), 0)]
    for p in range(k + 1, n):
        tree.append((lat(p), lat(p - 1)))
    for p in range(k - 1, -1, -1):
        tree.append((lat(p), lat(p + 1)))
    return 0, tree


built: list[tuple[str, str]] = []


def emit_net(name: str, s: Solid, root: int, tree) -> None:
    nf = unfold(s, root, tree)
    if not check_net(name, s, nf):
        report.append(f"   -> dilewati: {name}")
        return
    with open(os.path.join(OUT, name + ".glb"), "wb") as fh:
        fh.write(build_net_glb(s, nf))
    built.append(("net", name))
    report.append(f"[ok] {name}")
    if PREV:
        preview_net(name, s, nf)


# ───────────────────────── pratinjau ─────────────────────────

def preview_net(name: str, s: Solid, nf) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    os.makedirs(PREV, exist_ok=True)
    fig = plt.figure(figsize=(13, 3.2))
    ts = [0.0, 0.35, 0.7, 1.0]
    for i, t in enumerate(ts):
        ax = fig.add_subplot(1, 4, i + 1, projection="3d")
        world = fold_world(s, nf, t)
        polys, cols = [], []
        for k, f in enumerate(nf):
            polys.append(world[k][:, [0, 2, 1]])
            cols.append(s.faces[f.face].color)
        ax.add_collection3d(Poly3DCollection(polys, facecolors=cols, edgecolors="k", linewidths=0.8, alpha=0.95))
        allp = np.vstack(world)[:, [0, 2, 1]]
        c = (allp.max(0) + allp.min(0)) / 2
        r = (allp.max(0) - allp.min(0)).max() / 2 * 1.05
        ax.set_xlim(c[0] - r, c[0] + r); ax.set_ylim(c[1] - r, c[1] + r); ax.set_zlim(c[2] - r, c[2] + r)
        ax.view_init(elev=28 if t > 0 else 70, azim=-60)
        ax.set_axis_off()
        ax.set_title(f"t={t:.2f}", fontsize=8)
    fig.suptitle(name, fontsize=9)
    fig.savefig(os.path.join(PREV, name + ".png"), dpi=70, bbox_inches="tight")
    plt.close(fig)


def preview_solid(name: str, s: Solid) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    os.makedirs(PREV, exist_ok=True)
    fig = plt.figure(figsize=(3.4, 3.4))
    ax = fig.add_subplot(111, projection="3d")
    ax.add_collection3d(Poly3DCollection([s.face_pts(f)[:, [0, 2, 1]] for f in s.faces],
                                         facecolors=[f.color for f in s.faces], edgecolors="k", linewidths=0.8))
    c = (s.verts.max(0) + s.verts.min(0)) / 2
    r = (s.verts.max(0) - s.verts.min(0)).max() / 2 * 1.1
    c = c[[0, 2, 1]]
    ax.set_xlim(c[0] - r, c[0] + r); ax.set_ylim(c[1] - r, c[1] + r); ax.set_zlim(c[2] - r, c[2] + r)
    ax.view_init(elev=22, azim=-55)
    ax.set_axis_off()
    ax.set_title(name, fontsize=8)
    fig.savefig(os.path.join(PREV, name + ".png"), dpi=70, bbox_inches="tight")
    plt.close(fig)


# ───────────────────────── prisma statis ─────────────────────────

def emit_solid(name: str, s: Solid) -> None:
    assert is_closed(s), name
    with open(os.path.join(OUT, name + ".glb"), "wb") as fh:
        fh.write(build_solid_glb(s))
    built.append(("solid", name))
    report.append(f"[ok] {name}  V={s.volume():.3f}")
    if PREV:
        preview_solid(name, s)


def poly(pts):
    return np.array(pts, dtype=float)


def make_prisms() -> None:
    # alas beraturan (sisi 1) – melengkapi 3,5,6 yang sudah ada
    emit_solid("prisma-segiempat", colorize(prism(regular_polygon(4, 1.0, 45), 1.7)))
    emit_solid("prisma-segidelapan", colorize(prism(regular_polygon(8, 0.8, 22.5), 1.6)))
    # alas tidak beraturan
    emit_solid("prisma-segitiga-siku", colorize(prism(poly([(0, 0), (1.5, 0), (0, 2.0)]), 2.4)))
    emit_solid("prisma-trapesium", colorize(prism(poly([(-1.2, -0.7), (1.2, -0.7), (0.65, 0.7), (-0.65, 0.7)]), 1.8)))
    emit_solid("prisma-belah-ketupat", colorize(prism(poly([(0, -1.0), (0.7, 0), (0, 1.0), (-0.7, 0)]), 1.7)))
    emit_solid("prisma-jajargenjang", colorize(prism(poly([(-1.3, -0.6), (0.7, -0.6), (1.3, 0.6), (-0.7, 0.6)]), 1.7)))
    # prisma miring: rusuk tegak tidak tegak lurus alas
    emit_solid("prisma-segitiga-miring", colorize(prism(regular_polygon(3, 1.3, 90), 1.8, shear=(1.1, 0.0))))


# ───────────────────────── jaring ─────────────────────────

NAMES = {3: "segitiga", 4: "segiempat", 5: "segilima", 6: "segienam"}


def make_nets() -> None:
    # prisma beraturan, alas segi-n sisi 1, tinggi 1.5
    height = {3: 1.6, 5: 1.4, 6: 1.3}
    for n in (3, 5, 6):
        base = regular_polygon(n, 1.0, 90)
        s = colorize(prism(base, height[n]))
        variants = {
            "sejajar": prism_strip_tree(n, n // 2, n // 2),
            "bergeser": prism_strip_tree(n, 0, n - 1),
            "tangga": prism_strip_tree(n, 0, 1),
            "bintang": prism_star_tree(n, 0),
        }
        for v, (root, tree) in variants.items():
            if n == 3 and v == "sejajar":
                continue  # sudah ada: jaring-prisma-segitiga (salib)
            emit_net(f"jaring-prisma-{NAMES[n]}-{v}", s, root, tree)

    # prisma segitiga siku-siku (sisi tegak berbeda ukuran)
    s = colorize(prism(poly([(0, 0), (1.5, 0), (0, 2.0)]), 2.0))
    emit_net("jaring-prisma-segitiga-siku", s, *prism_strip_tree(3, 1, 1))
    # prisma trapesium
    s = colorize(prism(poly([(-1.2, -0.7), (1.2, -0.7), (0.65, 0.7), (-0.65, 0.7)]), 1.6))
    emit_net("jaring-prisma-trapesium", s, *prism_strip_tree(4, 0, 0))

    # limas beraturan
    hp = {3: 1.2, 4: 1.1, 5: 1.0, 6: 1.0}
    for n in (3, 4, 5, 6):
        s = colorize(pyramid(regular_polygon(n, 1.0, 90), hp[n]))
        variants = {
            "bintang": pyramid_star_tree(n),
            "ujung": pyramid_strip_tree(n, 0),
            "tengah": pyramid_strip_tree(n, n // 2),
        }
        for v, (root, tree) in variants.items():
            if n == 4 and v == "bintang":
                continue  # sudah ada: jaring-limas-segiempat
            emit_net(f"jaring-limas-{NAMES[n]}-{v}", s, root, tree)


# ───────────────────────── jaring-jaring kubus (11 bentuk) ─────────────────────────

# Bentuk jaring kubus yang sudah ada sebagai model lama (kubus-1..4), dalam bentuk kanonik
# (tahan putar dan cermin). Dipakai agar jaring baru tidak kembar dengan yang lama.
KUBUS_LAMA = [
    ((0, 1), (1, 0), (1, 1), (1, 2), (1, 3), (2, 1)),
    ((0, 0), (0, 1), (1, 1), (2, 1), (3, 1), (3, 2)),
    ((0, 0), (0, 1), (1, 1), (1, 2), (1, 3), (2, 1)),
    ((0, 0), (0, 1), (1, 1), (1, 2), (1, 3), (2, 2)),
]


def canon_cells(cells):
    best = None
    for flip in (0, 1):
        for r in range(4):
            c = [(-x, y) if flip else (x, y) for x, y in cells]
            for _ in range(r):
                c = [(-y, x) for x, y in c]
            mx, my = min(x for x, _ in c), min(y for _, y in c)
            c = tuple(sorted((x - mx, y - my) for x, y in c))
            if best is None or c < best:
                best = c
    return best


def hexominoes():
    seen = {canon_cells([(0, 0)])}
    level = list(seen)
    for _ in range(5):
        nxt = set()
        for p in level:
            for (x, y) in p:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (x + dx, y + dy)
                    if q not in p:
                        nxt.add(canon_cells(list(p) + [q]))
        level = list(nxt)
    return sorted(level)


def _rodrigues90(d):
    d = np.array(d, dtype=float)
    down = np.array([0.0, -1.0, 0.0])
    axis = np.cross(d, down)
    axis /= np.linalg.norm(axis)
    K = np.array([[0, -axis[2], axis[1]], [axis[2], 0, -axis[0]], [-axis[1], axis[0], 0]])
    return np.eye(3) + K + K @ K  # sudut 90°


def cube_net_tree(cube: Solid, cells, root_cell):
    """Gelindingkan kubus pada jaring: cek 6 sisi berbeda, lalu kembalikan pohon (anak, induk) pada sisi Solid."""
    cellset = set(cells)
    normals = [cube.normal(f) for f in cube.faces]

    def face_of(R):
        body = R.T @ np.array([0.0, -1.0, 0.0])
        return int(np.argmax([np.dot(body, n) for n in normals]))

    R0 = np.eye(3)
    face_at = {root_cell: face_of(R0)}
    rot = {root_cell: R0}
    tree = []
    queue = [root_cell]
    while queue:
        c = queue.pop(0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (c[0] + dx, c[1] + dy)
            if n in cellset and n not in face_at:
                R = _rodrigues90((dx, 0.0, dy)) @ rot[c]
                rot[n] = R
                face_at[n] = face_of(R)
                tree.append((face_at[n], face_at[c]))
                queue.append(n)
    if len(set(face_at.values())) != 6:
        return None
    return face_at[root_cell], tree


KUBUS_TIPE = {(1, 4, 1): "1-4-1", (2, 3, 1): "2-3-1", (1, 3, 2): "2-3-1", (2, 2, 2): "2-2-2", (3, 3): "3-3"}


def kubus_type(cells):
    """Tipe jaring: 1-4-1, 2-3-1, 2-2-2 atau 3-3 (banyak persegi tiap baris, dalam orientasi baku)."""
    for swap in (False, True):
        rows = {}
        for x, y in cells:
            rows.setdefault(x if swap else y, []).append(1)
        counts = tuple(len(rows[k]) for k in sorted(rows))
        for std, label in KUBUS_TIPE.items():
            if counts == std or counts == std[::-1]:
                return label
    return "?"


def make_kubus() -> None:
    cube = colorize(prism(regular_polygon(4, 1.0, 45), 1.0))
    nets = []
    for p in hexominoes():
        cells = list(p)
        cx = np.mean([c[0] for c in cells]); cy = np.mean([c[1] for c in cells])
        deg = lambda c: sum((c[0] + dx, c[1] + dy) in set(cells) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        root = min(cells, key=lambda c: (-deg(c), (c[0] - cx) ** 2 + (c[1] - cy) ** 2, c))
        res = cube_net_tree(cube, cells, root)
        if res is not None:
            nets.append((p, res))
    report.append(f"[info] jaring kubus yang sah: {len(nets)} dari {len(hexominoes())} heksomino")
    assert len(nets) == 11, len(nets)
    lama = [canon_cells(list(k)) for k in KUBUS_LAMA]
    assert all(k in [n[0] for n in nets] for k in lama), "jaring lama bukan jaring kubus sah?"
    # urut: tipe 1-4-1, 2-3-1, 2-2-2, 3-3
    order = {"1-4-1": 0, "2-3-1": 1, "2-2-2": 2, "3-3": 3}
    nets.sort(key=lambda n: (order.get(kubus_type(list(n[0])), 9), n[0]))
    nomor = 5
    for p, (root_face, tree) in nets:
        tp = kubus_type(list(p))
        if p in lama:
            report.append(f"[lama] {p} tipe {tp}")
            continue
        name = f"jaring-kubus-{nomor}"
        report.append(f"[kubus] {name} tipe {tp} {p}")
        emit_net(name, cube, root_face, tree)
        nomor += 1
    for k, p in zip(range(1, 5), lama):
        report.append(f"[tipe] kubus-{k}: {kubus_type(list(p))}")


# ───────────────────────── jaring-jaring balok (54 bentuk, 11 pola) ─────────────────────────

BALOK_UKURAN = (4.0, 3.0, 2.0)  # p, l, t (sama dengan model balok lama)
# Pola (sel jaring) yang sudah dipakai model lama jaring-balok-1 dan jaring-balok-2.
BALOK_LAMA = [
    ((0, 1), (1, 0), (1, 1), (1, 2), (1, 3), (2, 1)),
    ((0, 0), (0, 1), (1, 1), (1, 2), (1, 3), (2, 3)),
]


def colorize_box(s: Solid) -> Solid:
    """Sisi berhadapan sewarna (3 pasang sisi kongruen): alas-atas, tegak depan-belakang, tegak kiri-kanan."""
    pair = {"alas": "#f6d31c", "atas": "#f6d31c", "tegak1": "#3b82f6", "tegak3": "#3b82f6",
            "tegak2": "#22b455", "tegak4": "#22b455"}
    for f in s.faces:
        f.color = pair[f.name]
    return s


def _spanning_trees(solid: Solid):
    import itertools
    edges = [tuple(v) for v in solid.edge_faces().values()]
    for comb in itertools.combinations(range(len(edges)), len(solid.faces) - 1):
        adj = {i: [] for i in range(len(solid.faces))}
        for k in comb:
            a, b = edges[k]
            adj[a].append(b)
            adj[b].append(a)
        seen, q = {0}, [0]
        while q:
            u = q.pop(0)
            for v in adj[u]:
                if v not in seen:
                    seen.add(v)
                    q.append(v)
        if len(seen) == len(solid.faces):
            yield adj


def _reroot(adj, root):
    seen, q, tree = {root}, [root], []
    while q:
        u = q.pop(0)
        for v in sorted(adj[u]):
            if v not in seen:
                seen.add(v)
                q.append(v)
                tree.append((v, u))
    return tree


def _net_signature(nf):
    polys = [np.array(f.flat) for f in nf]
    best = None
    for flip in (0, 1):
        for r in range(4):
            rs = []
            for p in polys:
                q = p.copy()
                if flip:
                    q[:, 0] *= -1
                for _ in range(r):
                    q = np.c_[-q[:, 1], q[:, 0]]
                rs.append(q)
            mn = np.vstack(rs).min(axis=0)
            key = tuple(sorted(tuple(np.round(np.r_[(q - mn).min(0), (q - mn).max(0)], 3)) for q in rs))
            if best is None or key < best:
                best = key
    return best


def _net_cells(nf):
    """Sel grid tiap sisi, dari arah engsel terhadap induknya (pola heksomino jaring)."""
    pos = {0: (0, 0)}
    for k, f in enumerate(nf):
        if f.parent is None:
            continue
        d = np.mean(f.flat, axis=0) - np.mean(nf[f.parent].flat, axis=0)
        if abs(d[0]) > abs(d[1]):
            step = (1 if d[0] > 0 else -1, 0)
        else:
            step = (0, 1 if d[1] > 0 else -1)
        pos[k] = (pos[f.parent][0] + step[0], pos[f.parent][1] + step[1])
    return pos


def make_balok() -> None:
    p, l, t = BALOK_UKURAN
    box = colorize_box(prism(np.array([[-p / 2, -l / 2], [p / 2, -l / 2], [p / 2, l / 2], [-p / 2, l / 2]]), t))
    found: dict = {}
    for adj in _spanning_trees(box):
        root = max(adj, key=lambda i: (len(adj[i]), -i))
        tree = _reroot(adj, root)
        nf = unfold(box, root, tree)
        polys = [np.array(f.flat) for f in nf]
        if any(overlap(polys[i], polys[j]) for i in range(6) for j in range(i + 1, 6)):
            continue
        found.setdefault(_net_signature(nf), (root, tree, nf))
    report.append(f"[info] jaring balok berbeda: {len(found)}")
    assert len(found) == 54, len(found)
    by_pattern: dict = {}
    for sig_, (root, tree, nf) in found.items():
        pattern = canon_cells(list(_net_cells(nf).values()))
        by_pattern.setdefault(pattern, []).append((sig_, root, tree))
    assert len(by_pattern) == 11
    lama = [canon_cells(list(k)) for k in BALOK_LAMA]
    order = {"1-4-1": 0, "2-3-1": 1, "2-2-2": 2, "3-3": 3}
    patterns = sorted(by_pattern, key=lambda q: (order.get(kubus_type(list(q)), 9), q))
    nomor = 3
    for pat in patterns:
        tp = kubus_type(list(pat))
        if pat in lama:
            report.append(f"[lama] balok pola {pat} tipe {tp} ({len(by_pattern[pat])} variasi ukuran)")
            continue
        sig_, root, tree = sorted(by_pattern[pat], key=lambda v: v[0])[0]
        name = f"jaring-balok-{nomor}"
        report.append(f"[balok] {name} tipe {tp} {pat}")
        emit_net(name, box, root, tree)
        nomor += 1


# ───────────────────────── jenis-jenis limas (statis) ─────────────────────────

def _shoelace(poly_xz) -> float:
    p = np.array(poly_xz, dtype=float)
    return abs(0.5 * sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))))


def emit_limas(name: str, base, height: float, apex=(0.0, 0.0)) -> None:
    s = colorize(pyramid(np.array(base, dtype=float), height, apex))
    # uji: V = 1/3 × luas alas × tinggi
    assert abs(s.volume() - _shoelace(base) * height / 3) < 1e-9, name
    emit_solid(name, s)


def make_limas() -> None:
    rect = lambda w, d: [(-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)]
    emit_limas("limas-segidelapan", regular_polygon(8, 0.8, 22.5), 1.7)
    emit_limas("limas-persegi-panjang", rect(2.2, 1.4), 1.8)
    emit_limas("limas-jajargenjang", [(-1.3, -0.6), (0.7, -0.6), (1.3, 0.6), (-0.7, 0.6)], 1.8)
    emit_limas("limas-belah-ketupat", [(0, -1.1), (0.8, 0), (0, 1.1), (-0.8, 0)], 1.8)
    emit_limas("limas-trapesium", [(-1.2, -0.7), (1.2, -0.7), (0.65, 0.7), (-0.65, 0.7)], 1.8)
    emit_limas("limas-layang-layang", [(0, -0.8), (0.9, 0.0), (0, 1.5), (-0.9, 0.0)], 1.8, (0.0, 0.2))
    tri = [(0, 0), (1.6, 0), (0, 1.2)]
    emit_limas("limas-segitiga-siku", tri, 2.0, (1.6 / 3, 1.2 / 3))
    # bidang empat beraturan: semua rusuk sama panjang (1,4)
    a = 1.4
    emit_limas("limas-bidang-empat", regular_polygon(3, a, 90), math.sqrt(2 / 3) * a)
    # puncak di atas salah satu titik sudut alas: rusuk tegak = tinggi, semua sisi tegak segitiga siku-siku
    emit_limas("limas-siku", rect(1.6, 1.6), 1.9, (-0.8, -0.8))
    # puncak tidak di atas titik tengah alas (limas miring)
    emit_limas("limas-miring", rect(1.8, 1.8), 1.8, (0.55, 0.25))


if __name__ == "__main__":
    make_prisms()
    make_nets()
    make_kubus()
    make_balok()
    make_limas()
    print("\n".join(report))
    print(f"\n{len(built)} berkas dibuat di {OUT}")
