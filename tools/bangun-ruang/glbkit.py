"""Pembuat berkas .glb (glTF biner) tanpa dependensi selain numpy.

Dua jenis model:
  * benda padat statis  (prisma, limas)  -> build_solid_glb
  * jaring-jaring beranimasi (melipat)   -> build_net_glb

Jaring-jaring dibuat dari benda padat: tiap sisi menjadi satu simpul (node)
yang berporos pada rusuk yang dibagi dengan sisi induknya. Animasi memutar
simpul tersebut sehingga bidang datar terlipat menjadi benda ruang.
"""
from __future__ import annotations

import json
import math
import struct
from dataclasses import dataclass, field

import numpy as np


# ───────────────────────── warna ─────────────────────────

def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgba(h: str) -> list[float]:
    h = h.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return [srgb_to_linear(r), srgb_to_linear(g), srgb_to_linear(b), 1.0]


# ───────────────────────── benda padat ─────────────────────────

@dataclass
class Face:
    idx: list[int]          # indeks titik, berurutan mengelilingi sisi
    color: str              # warna heksa
    name: str = ""


@dataclass
class Solid:
    verts: np.ndarray                      # (N,3)  y = atas
    faces: list[Face] = field(default_factory=list)

    def face_pts(self, f: Face) -> np.ndarray:
        return self.verts[f.idx]

    def normal(self, f: Face) -> np.ndarray:
        p = self.face_pts(f)
        n = np.zeros(3)
        for i in range(len(p)):
            n += np.cross(p[i], p[(i + 1) % len(p)])
        return n / np.linalg.norm(n)

    def centroid(self) -> np.ndarray:
        return self.verts.mean(axis=0)

    def orient_outward(self) -> None:
        """Putar urutan titik tiap sisi agar normalnya mengarah keluar."""
        c = self.centroid()
        for f in self.faces:
            p = self.face_pts(f)
            if np.dot(self.normal(f), p.mean(axis=0) - c) < 0:
                f.idx = f.idx[::-1]

    def volume(self) -> float:
        v = 0.0
        for f in self.faces:
            p = self.face_pts(f)
            for i in range(1, len(p) - 1):
                v += np.dot(p[0], np.cross(p[i], p[i + 1])) / 6
        return abs(v)

    def edge_faces(self) -> dict[tuple[int, int], list[int]]:
        out: dict[tuple[int, int], list[int]] = {}
        for fi, f in enumerate(self.faces):
            for i in range(len(f.idx)):
                a, b = f.idx[i], f.idx[(i + 1) % len(f.idx)]
                out.setdefault((min(a, b), max(a, b)), []).append(fi)
        return out


def is_closed(solid: Solid) -> bool:
    return all(len(v) == 2 for v in solid.edge_faces().values())


def prism(base: np.ndarray, height: float, shear=(0.0, 0.0), c_base="#f59e0b", c_top="#ef4444",
          c_side=("#3b82f6", "#60a5fa")) -> Solid:
    """Prisma dengan alas poligon `base` (n,2) pada bidang xz, tinggi sepanjang y.
    `shear` menggeser tutup (prisma miring)."""
    n = len(base)
    verts = np.array([[x, 0.0, z] for x, z in base] +
                     [[x + shear[0], height, z + shear[1]] for x, z in base])
    faces = [Face(list(range(n)), c_base, "alas"), Face([n + i for i in range(n)], c_top, "atas")]
    for i in range(n):
        j = (i + 1) % n
        faces.append(Face([i, j, n + j, n + i], c_side[i % 2], f"tegak{i + 1}"))
    s = Solid(verts, faces)
    s.orient_outward()
    return s


def pyramid(base: np.ndarray, height: float, apex_xz=(0.0, 0.0), c_base="#f59e0b",
            c_side=("#3b82f6", "#60a5fa")) -> Solid:
    n = len(base)
    verts = np.array([[x, 0.0, z] for x, z in base] + [[apex_xz[0], height, apex_xz[1]]])
    faces = [Face(list(range(n)), c_base, "alas")]
    for i in range(n):
        j = (i + 1) % n
        faces.append(Face([i, j, n], c_side[i % 2], f"tegak{i + 1}"))
    s = Solid(verts, faces)
    s.orient_outward()
    return s


def regular_polygon(n: int, side: float = 1.0, start_deg: float = 90.0) -> np.ndarray:
    r = side / (2 * math.sin(math.pi / n))
    return np.array([[r * math.cos(math.radians(start_deg) + 2 * math.pi * k / n),
                      r * math.sin(math.radians(start_deg) + 2 * math.pi * k / n)] for k in range(n)])


# ───────────────────────── penulis glTF ─────────────────────────

class _Builder:
    def __init__(self) -> None:
        self.bin = bytearray()
        self.views: list[dict] = []
        self.accessors: list[dict] = []

    def _pad(self) -> None:
        while len(self.bin) % 4:
            self.bin.append(0)

    def add(self, data: bytes, comp: int, count: int, typ: str, target: int | None = None,
            minmax: tuple | None = None) -> int:
        self._pad()
        view = {"buffer": 0, "byteOffset": len(self.bin), "byteLength": len(data)}
        if target:
            view["target"] = target
        self.bin += data
        self.views.append(view)
        acc = {"bufferView": len(self.views) - 1, "componentType": comp, "count": count, "type": typ}
        if minmax:
            acc["min"], acc["max"] = [list(map(float, minmax[0])), list(map(float, minmax[1]))]
        self.accessors.append(acc)
        return len(self.accessors) - 1


def _triangulate_fan(n: int) -> list[tuple[int, int, int]]:
    return [(0, i, i + 1) for i in range(1, n - 1)]


def _face_mesh(b: _Builder, pts: np.ndarray, normal: np.ndarray) -> int:
    """Satu poligon cembung -> akses posisi, normal, indeks. Mengembalikan indeks mesh-primitive."""
    n = len(pts)
    pos = pts.astype("<f4")
    nor = np.tile(normal.astype("<f4"), (n, 1))
    idx = np.array(_triangulate_fan(n), dtype="<u2").reshape(-1)
    a_pos = b.add(pos.tobytes(), 5126, n, "VEC3", 34962, (pos.min(axis=0), pos.max(axis=0)))
    a_nor = b.add(nor.tobytes(), 5126, n, "VEC3", 34962)
    a_idx = b.add(idx.tobytes(), 5123, len(idx), "SCALAR", 34963, ([idx.min()], [idx.max()]))
    return a_pos, a_nor, a_idx


def _assemble(b: _Builder, doc: dict) -> bytes:
    doc["asset"] = {"version": "2.0", "generator": "1729 glbkit"}
    doc["buffers"] = [{"byteLength": len(b.bin)}]
    doc["bufferViews"] = b.views
    doc["accessors"] = b.accessors
    js = json.dumps(doc, separators=(",", ":")).encode()
    while len(js) % 4:
        js += b" "
    binb = bytes(b.bin)
    while len(binb) % 4:
        binb += b"\0"
    total = 12 + 8 + len(js) + 8 + len(binb)
    return (struct.pack("<III", 0x46546C67, 2, total) + struct.pack("<II", len(js), 0x4E4F534A) + js +
            struct.pack("<II", len(binb), 0x004E4942) + binb)


def _material(color: str, name: str) -> dict:
    return {"name": name, "doubleSided": True,
            "pbrMetallicRoughness": {"baseColorFactor": hex_rgba(color), "metallicFactor": 0.0, "roughnessFactor": 0.55}}


def build_solid_glb(solid: Solid) -> bytes:
    """Benda padat statis: satu mesh per sisi (warna per sisi)."""
    b = _Builder()
    materials: list[dict] = []
    mat_of: dict[str, int] = {}
    meshes, nodes = [], []
    for f in solid.faces:
        if f.color not in mat_of:
            mat_of[f.color] = len(materials)
            materials.append(_material(f.color, f.color))
        p, n, i = _face_mesh(b, solid.face_pts(f), solid.normal(f))
        meshes.append({"name": f.name, "primitives": [{"attributes": {"POSITION": p, "NORMAL": n},
                                                       "indices": i, "material": mat_of[f.color], "mode": 4}]})
        nodes.append({"mesh": len(meshes) - 1, "name": f.name or f"sisi{len(nodes)}"})
    doc = {"scene": 0, "scenes": [{"nodes": list(range(len(nodes)))}], "nodes": nodes,
           "meshes": meshes, "materials": materials}
    return _assemble(b, doc)


# ───────────────────────── jaring-jaring ─────────────────────────

@dataclass
class NetFace:
    face: int                      # indeks sisi pada Solid
    parent: int | None             # indeks NetFace induk
    edge: tuple[int, int] | None   # (a,b) indeks titik Solid pada rusuk bersama
    flat: np.ndarray = None        # (n,2) koordinat jaring datar pada bidang xz
    hinge2d: np.ndarray = None     # titik poros (2,)
    axis2d: np.ndarray = None      # arah poros (2,), terpilih agar lipatan menuju +y
    fold: float = 0.0              # sudut lipat akhir (rad)
    depth: int = 0


def _basis(solid: Solid, f: Face) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    p = solid.face_pts(f)
    o = p[0]
    u = p[1] - p[0]
    u /= np.linalg.norm(u)
    n = solid.normal(f)
    v = np.cross(n, u)
    return o, u, v


def _local2d(solid: Solid, f: Face) -> dict[int, np.ndarray]:
    o, u, v = _basis(solid, f)
    return {i: np.array([np.dot(solid.verts[i] - o, u), np.dot(solid.verts[i] - o, v)]) for i in f.idx}


def unfold(solid: Solid, root: int, tree: list[tuple[int, int]]) -> list[NetFace]:
    """tree: daftar (sisi_anak, sisi_induk). Mengembalikan NetFace berurutan (induk sebelum anak)."""
    ef = solid.edge_faces()
    nf: list[NetFace] = []
    pos_of: dict[int, int] = {}
    # akar: letakkan pada bidang xz dengan arah pandang dari luar (-y) -> normal luar = -y
    local = _local2d(solid, solid.faces[root])
    # cermin agar sisi luar menghadap bawah (-y): koordinat (u,v) -> (x,z) = (u, -v)? uji dengan luas bertanda
    pts = np.array([local[i] for i in solid.faces[root].idx])
    area = 0.5 * sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    # (u,v,n) berorientasi tangan kanan -> luas tertanda positif untuk urutan berlawanan jarum jam dari luar.
    assert area > 0
    flat_root = {i: np.array([local[i][0], local[i][1]]) for i in solid.faces[root].idx}
    # peta ke (x,z): x=u, z=v  -> normal luar menunjuk ke (u x v) = n; di dunia (x,z) normal = x cross z = -y.
    # (e_x cross e_z = -e_y) sehingga bidang menghadap luar ke bawah. Bagus: padat berada di atas (y>0).
    nf.append(NetFace(root, None, None, np.array([flat_root[i] for i in solid.faces[root].idx]), None, None, 0.0, 0))
    flats: dict[int, dict[int, np.ndarray]] = {root: flat_root}
    pos_of[root] = 0
    for child, par in tree:
        pf = solid.faces[par]
        cf = solid.faces[child]
        shared = set(pf.idx) & set(cf.idx)
        assert len(shared) == 2, (child, par, shared)
        a, b = sorted(shared)
        assert len(ef[(a, b)]) == 2
        pa, pb = flats[par][a], flats[par][b]
        cl = _local2d(solid, cf)
        ca, cb = cl[a], cl[b]
        # rotasi 2D yang memetakan vektor (ca->cb) ke (pa->pb); lalu pilih refleksi agar anak di sisi lain
        def solve(mirror: bool):
            def m(p):
                return np.array([p[0], -p[1]]) if mirror else p
            va, vb = m(cb) - m(ca), pb - pa
            ang = math.atan2(vb[1], vb[0]) - math.atan2(va[1], va[0])
            R = np.array([[math.cos(ang), -math.sin(ang)], [math.sin(ang), math.cos(ang)]])
            return {i: pa + R @ (m(cl[i]) - m(ca)) for i in cf.idx}
        # pusat induk
        pc = np.mean([flats[par][i] for i in pf.idx], axis=0)
        edge_dir = pb - pa
        side_par = np.sign(edge_dir[0] * (pc - pa)[1] - edge_dir[1] * (pc - pa)[0])
        chosen = None
        for mirror in (False, True):
            cand = solve(mirror)
            cc = np.mean([cand[i] for i in cf.idx], axis=0)
            side_c = np.sign(edge_dir[0] * (cc - pa)[1] - edge_dir[1] * (cc - pa)[0])
            # orientasi harus tetap konsisten: urutan titik anak harus berarah sama dengan induk (luas tertanda sama)
            pts = np.array([cand[i] for i in cf.idx])
            ar = 0.5 * sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
            if side_c != side_par and ar > 0:
                chosen = cand
        assert chosen is not None
        flats[child] = chosen
        # sudut lipat = pi - sudut dihedral dalam
        n1, n2 = solid.normal(pf), solid.normal(cf)
        dihedral = math.pi - math.acos(np.clip(np.dot(n1, n2), -1, 1))
        fold = math.pi - dihedral
        # arah poros agar anak terangkat ke +y: u x s = +y, s = vektor ke arah anak
        cc = np.mean([chosen[i] for i in cf.idx], axis=0)
        s2 = cc - pa
        u2 = (pb - pa) / np.linalg.norm(pb - pa)
        # di dunia: u=(ux,0,uz), s=(sx,0,sz); (u x s).y = uz*sx - ux*sz
        cross_y = u2[1] * s2[0] - u2[0] * s2[1]
        if cross_y < 0:
            u2 = -u2
        pos_of[child] = len(nf)
        nf.append(NetFace(child, pos_of[par], (a, b), np.array([chosen[i] for i in cf.idx]), pa.copy(), u2, fold,
                          nf[pos_of[par]].depth + 1))
    return nf


def _quat_axis_angle(axis_xz: np.ndarray, ang: float) -> list[float]:
    ax = np.array([axis_xz[0], 0.0, axis_xz[1]])
    ax /= np.linalg.norm(ax)
    s = math.sin(ang / 2)
    return [ax[0] * s, ax[1] * s, ax[2] * s, math.cos(ang / 2)]


def fold_world(solid: Solid, nf: list[NetFace], t_fold: float = 1.0) -> list[np.ndarray]:
    """Posisi dunia 3D tiap titik sisi setelah dilipat sebesar t_fold (0..1). Untuk verifikasi."""
    out: list[np.ndarray] = [None] * len(nf)  # type: ignore
    # matriks dunia tiap node
    mats: list[np.ndarray] = [None] * len(nf)  # type: ignore
    for k, f in enumerate(nf):
        if f.parent is None:
            T = np.eye(4)
        else:
            par = nf[f.parent]
            origin_par = par.hinge2d if par.hinge2d is not None else np.zeros(2)
            tr = f.hinge2d - origin_par
            T0 = np.eye(4)
            T0[:3, 3] = [tr[0], 0.0, tr[1]]
            q = _quat_axis_angle(f.axis2d, f.fold * t_fold)
            T = mats[f.parent] @ T0 @ _qmat(q)
        mats[k] = T
        origin = f.hinge2d if f.hinge2d is not None else np.zeros(2)
        pts = []
        for p in f.flat:
            loc = np.array([p[0] - origin[0], 0.0, p[1] - origin[1], 1.0])
            pts.append((T @ loc)[:3])
        out[k] = np.array(pts)
    return out


def _qmat(q: list[float]) -> np.ndarray:
    x, y, z, w = q
    M = np.eye(4)
    M[:3, :3] = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                 [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                 [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
    return M


def _slerp_free(q0, q1, t):  # tidak dipakai; sudut dikontrol lewat banyak kunci
    raise NotImplementedError


def build_net_glb(solid: Solid, nf: list[NetFace], hold_start: float = 1.2, hold_end: float = 1.6,
                  per_fold: float = 1.5, stagger: float = 0.55) -> bytes:
    """Jaring-jaring beranimasi: terlipat bertahap, lapis demi lapis dari sisi akar."""
    b = _Builder()
    materials: list[dict] = []
    mat_of: dict[str, int] = {}
    meshes, nodes, children = [], [], {k: [] for k in range(len(nf))}
    for k, f in enumerate(nf):
        if f.parent is not None:
            children[f.parent].append(k)

    # waktu mulai tiap lipatan: anak mulai setelah induk sedikit selesai (bertahap per kedalaman, urut per saudara)
    start: dict[int, float] = {}
    order = sorted(range(len(nf)), key=lambda k: (nf[k].depth, k))
    sib_count: dict[int, int] = {}
    for k in order:
        f = nf[k]
        if f.parent is None:
            continue
        base = hold_start
        if nf[f.parent].parent is not None:
            base = start[f.parent] + per_fold * 0.55
        i = sib_count.get(f.parent, 0)
        sib_count[f.parent] = i + 1
        start[k] = base + (stagger * i if nf[f.parent].parent is None or True else 0)
    last_end = max(start[k] + per_fold for k in start) if start else hold_start
    total = last_end + hold_end

    times_acc = None
    node_of: dict[int, int] = {}
    for k, f in enumerate(nf):
        sf = solid.faces[f.face]
        if sf.color not in mat_of:
            mat_of[sf.color] = len(materials)
            materials.append(_material(sf.color, sf.color))
        origin = f.hinge2d if f.hinge2d is not None else np.zeros(2)
        pts3 = np.array([[p[0] - origin[0], 0.0, p[1] - origin[1]] for p in f.flat])
        # normal luar saat datar menghadap -y (lihat unfold); sisi dalam +y. DoubleSide dipaksa di aplikasi.
        p, n, i = _face_mesh(b, pts3, np.array([0.0, -1.0, 0.0]))
        meshes.append({"name": sf.name, "primitives": [{"attributes": {"POSITION": p, "NORMAL": n}, "indices": i,
                                                        "material": mat_of[sf.color], "mode": 4}]})
        node: dict = {"name": f"{sf.name or 'sisi'}_{k}", "mesh": len(meshes) - 1}
        if f.parent is not None:
            par = nf[f.parent]
            po = par.hinge2d if par.hinge2d is not None else np.zeros(2)
            tr = f.hinge2d - po
            node["translation"] = [float(tr[0]), 0.0, float(tr[1])]
            node["rotation"] = [0.0, 0.0, 0.0, 1.0]
        node_of[k] = len(nodes)
        nodes.append(node)
    for k, f in enumerate(nf):
        if children[k]:
            nodes[node_of[k]]["children"] = [node_of[c] for c in children[k]]

    # animasi: rotasi tiap simpul anak, banyak kunci agar slerp mengikuti sudut mendekati linear
    samplers, channels = [], []
    steps = 8
    for k, f in enumerate(nf):
        if f.parent is None:
            continue
        times = [0.0, start[k]] + [start[k] + per_fold * s / steps for s in range(1, steps + 1)] + [total]
        quats = [_quat_axis_angle(f.axis2d, 0.0), _quat_axis_angle(f.axis2d, 0.0)]
        for s in range(1, steps + 1):
            # ease in-out lembut
            x = s / steps
            e = x * x * (3 - 2 * x)
            quats.append(_quat_axis_angle(f.axis2d, f.fold * e))
        quats.append(_quat_axis_angle(f.axis2d, f.fold))
        tarr = np.array(times, dtype="<f4")
        qarr = np.array(quats, dtype="<f4")
        a_t = b.add(tarr.tobytes(), 5126, len(tarr), "SCALAR", None, ([tarr.min()], [tarr.max()]))
        a_q = b.add(qarr.tobytes(), 5126, len(qarr), "VEC4")
        samplers.append({"input": a_t, "output": a_q, "interpolation": "LINEAR"})
        channels.append({"sampler": len(samplers) - 1, "target": {"node": node_of[k], "path": "rotation"}})

    root_nodes = [node_of[k] for k, f in enumerate(nf) if f.parent is None]
    doc = {"scene": 0, "scenes": [{"nodes": root_nodes}], "nodes": nodes, "meshes": meshes, "materials": materials,
           "animations": [{"name": "Lipat", "samplers": samplers, "channels": channels}]}
    return _assemble(b, doc)
