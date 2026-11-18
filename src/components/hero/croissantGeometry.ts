import * as THREE from "three";

/* ------------------------------------------------------------------
   Procedural croissant.
   A crescent-shaped tube whose radius is sculpted into rolled bands
   (the laminated dough wrapping round itself), with fine layer lines
   at the creases, a flattened base, tapered tips, organic noise and
   baked-colour vertex shading (pale in the creases, deep gold on top).
   No external model files — everything is generated at runtime.
------------------------------------------------------------------- */

function hash(n: number) {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function noise3(x: number, y: number, z: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz);
  const n = ix + iy * 57 + iz * 113;
  return lerp(
    lerp(lerp(hash(n), hash(n + 1), ux), lerp(hash(n + 57), hash(n + 58), ux), uy),
    lerp(lerp(hash(n + 113), hash(n + 114), ux), lerp(hash(n + 170), hash(n + 171), ux), uy),
    uz,
  );
}
function fbm(x: number, y: number, z: number) {
  let v = 0, a = 0.5;
  for (let i = 0; i < 4; i++) {
    v += a * noise3(x, y, z);
    x *= 2.03; y *= 2.03; z *= 2.03;
    a *= 0.5;
  }
  return v;
}

function spine(u: number, out: THREE.Vector3) {
  const t = u * 2 - 1;
  const th = t * 1.08 * (1 + 0.24 * t * t);
  return out.set(Math.sin(th) * 1.08, -0.11 * Math.pow(Math.abs(t), 3), -Math.cos(th) + 0.5);
}

export function createCroissantGeometry(segU = 260, segV = 100) {
  const K = 3.15; // how many rolled bands from centre to tip
  const count = (segU + 1) * (segV + 1);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);

  const pale = new THREE.Color("#f6dfb0");
  const golden = new THREE.Color("#d9993f");
  const deep = new THREE.Color("#94461a");
  const dark = new THREE.Color("#5e2a0e");
  const base = new THREE.Color("#b36d2c");

  const P = new THREE.Vector3(), A = new THREE.Vector3(), B2 = new THREE.Vector3();
  const T = new THREE.Vector3(), B = new THREE.Vector3(), N = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const c = new THREE.Color();

  let k = 0;
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const t = u * 2 - 1;
    const a = Math.abs(t);
    spine(u, P);
    spine(Math.max(0, u - 0.002), A);
    spine(Math.min(1, u + 0.002), B2);
    T.subVectors(B2, A).normalize();
    B.crossVectors(T, up).normalize(); // points to the inner (concave) side
    N.crossVectors(B, T).normalize(); // up-ish

    const env = Math.pow(Math.sin(Math.PI * u), 0.72);
    const rBase = 0.45 * env * (1 - 0.1 * a);

    for (let j = 0; j <= segV; j++) {
      const v = -Math.PI / 2 + (j / segV) * Math.PI * 2; // seam on the underside
      const cv = Math.cos(v), sv = Math.sin(v);

      // band coordinate — bands narrow towards the tips and lean slightly
      const s = ((a + 0.55 * a * a) / 1.55) * K + 0.5 + 0.12 * cv * smooth(0.02, 0.2, a);
      const band = Math.floor(s);
      const f = s - band;
      const bump = Math.pow(Math.sin(Math.PI * f), 0.32);
      const topness = smooth(-0.55, 0.35, sv); // bands fade out on the flat base
      const bandScale = 1 + 0.08 * (hash(band * 7.13 + (t < 0 ? 3.1 : 0)) - 0.5);
      const layers = 0.03 * Math.sin(f * Math.PI * 2 * 3) * Math.pow(1 - bump, 2) * topness;

      const nz = fbm(P.x * 3.2 + cv * 1.3, P.y * 3.2 + sv * 1.3, P.z * 3.2);
      let r = rBase * lerp(0.93, 0.66 + 0.34 * bump, topness) * bandScale + rBase * layers;
      r *= 1 + (nz - 0.5) * 0.11;

      const yScale = sv < 0 ? 0.5 : 0.94;
      const x = cv * r * 1.07;
      const y = sv * r * yScale;
      pos[k * 3] = P.x + B.x * x + N.x * y;
      pos[k * 3 + 1] = P.y + B.y * x + N.y * y;
      pos[k * 3 + 2] = P.z + B.z * x + N.z * y;

      // baked colour
      const top = Math.max(0, sv);
      const spot = fbm(P.x * 9 + 11, P.y * 9 + sv * 2, P.z * 9 + cv * 2);
      c.copy(pale).lerp(golden, smooth(0.1, 0.62, bump));
      c.lerp(deep, Math.min(1, Math.pow(bump, 1.6) * (0.3 + 0.75 * top) * topness * (0.75 + 0.6 * spot)));
      c.lerp(dark, Math.pow(a, 3.2) * 0.6 + smooth(0.62, 0.8, spot) * 0.25 * top);
      if (sv < -0.2) c.lerp(base, smooth(-0.2, -0.8, sv) * 0.55);
      c.multiplyScalar(0.86 + 0.26 * nz);
      col[k * 3] = c.r;
      col[k * 3 + 1] = c.g;
      col[k * 3 + 2] = c.b;

      uvs[k * 2] = s * 0.5;
      uvs[k * 2 + 1] = j / segV;
      k++;
    }
  }

  const index: number[] = [];
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a0 = i * (segV + 1) + j;
      const b0 = (i + 1) * (segV + 1) + j;
      index.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

/** Organic blister / flake texture (blotchy noise with faint streaks), used as a bump map. */
export function createFlakeTexture(size = 512) {
  const w = size, h = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      // periodic in x so the texture tiles along the croissant
      const ang = nx * Math.PI * 2;
      const blot = fbm(Math.cos(ang) * 3 + 10, Math.sin(ang) * 3 + 10, ny * 6);
      const fine = noise3(Math.cos(ang) * 24, Math.sin(ang) * 24, ny * 48);
      const streak = 0.5 + 0.5 * Math.sin(x * 0.45 + blot * 6);
      let v = 0.15 + blot * 0.9 + (fine - 0.5) * 0.35 + (streak - 0.5) * 0.12;
      v = Math.max(0, Math.min(1, v));
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}
