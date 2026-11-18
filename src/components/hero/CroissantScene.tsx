"use client";
/* eslint-disable react-hooks/immutability -- react-three-fiber mutates Three.js objects (camera, uniforms, buffers) inside useFrame by design; none of it is React state. */

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createCroissantGeometry, createFlakeTexture } from "./croissantGeometry";

/** Small seeded PRNG so particle layouts are deterministic (and render-pure). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SceneProps {
  progress: MutableRefObject<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  active: boolean;
  onReady?: () => void;
  onLost?: () => void;
  /** Fixed pose with no animation — used to render the static fallback image. */
  still?: boolean;
  quality?: "high" | "low";
}

/* ---------------- Croissant ---------------- */

function Croissant({ still }: { still?: boolean }) {
  const geometry = useMemo(() => createCroissantGeometry(), []);
  const flakes = useMemo(() => createFlakeTexture(), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.52,
        bumpMap: flakes,
        bumpScale: 0.9,
        clearcoat: 0.55,
        clearcoatRoughness: 0.3,
        sheen: 0.7,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#ffc779"),
        envMapIntensity: 0.9,
      }),
    [flakes],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      flakes.dispose();
    },
    [geometry, material, flakes],
  );
  return <mesh geometry={geometry} material={material} castShadow={!still} />;
}

/* ---------------- Crumbs drifting in slow motion ---------------- */

function Crumbs({ count = 34 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => {
    const rand = rng(7);
    return Array.from({ length: count }, (_, i) => ({
        r: 1.2 + rand() * 0.9,
        a: (i / count) * Math.PI * 2 + rand(),
        y: -0.35 + rand() * 1.2,
        s: 0.006 + rand() * 0.014,
        sp: 0.03 + rand() * 0.05,
        spin: rand() * 2,
      }));
  }, [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s.a + t * s.sp;
      dummy.position.set(Math.cos(a) * s.r, s.y + Math.sin(t * 0.4 + i) * 0.08, Math.sin(a) * s.r * 0.6);
      dummy.rotation.set(t * s.spin * 0.3, t * s.spin * 0.5, i);
      dummy.scale.set(s.s * 1.6, s.s * 0.5, s.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#e2aa5c" roughness={0.6} />
    </instancedMesh>
  );
}

/* ---------------- Flour dust in a beam of morning light ---------------- */

const dustVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uPR;
  uniform float uTime;
  varying float vA;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * (5.0 / -mv.z);
    vec3 d = normalize(vec3(0.62, -0.78, -0.1));
    vec3 o = vec3(-0.6, 0.9, 0.0);
    vec3 q = wp.xyz - o;
    float dist = length(q - dot(q, d) * d);
    float beam = smoothstep(1.5, 0.15, dist);
    float tw = 0.55 + 0.45 * sin(uTime * 1.3 + aSeed * 40.0);
    vA = (0.12 + 0.88 * beam) * tw;
  }
`;
const dustFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vA);
  }
`;

function FlourDust({ count = 420 }: { count?: number }) {
  const { gl } = useThree();
  const pts = useRef<THREE.Points>(null);
  const { geometry, vel } = useMemo(() => {
    const rand = rng(42);
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (rand() - 0.5) * 7;
      p[i * 3 + 1] = (rand() - 0.5) * 4.5;
      p[i * 3 + 2] = (rand() - 0.5) * 4 - 0.4;
      const near = p[i * 3 + 2] > 1.2;
      size[i] = near ? 6 + rand() * 10 : 1.5 + rand() * 3.5;
      seed[i] = rand();
      vel[i * 3] = 0.015 + rand() * 0.03;
      vel[i * 3 + 1] = -0.01 - rand() * 0.025;
      vel[i * 3 + 2] = (rand() - 0.5) * 0.01;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return { geometry: g, vel };
  }, [count]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVert,
        fragmentShader: dustFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uPR: { value: Math.min(gl.getPixelRatio(), 2) },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#fffaf0") },
        },
      }),
    [gl],
  );
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(({ clock }, dt) => {
    const step = Math.min(dt, 0.05);
    material.uniforms.uTime.value = clock.elapsedTime;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const p = attr.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      p[i * 3] += (vel[i * 3] + Math.sin(t * 0.3 + i) * 0.01) * step * 6;
      p[i * 3 + 1] += vel[i * 3 + 1] * step * 6;
      p[i * 3 + 2] += vel[i * 3 + 2] * step * 6;
      if (p[i * 3] > 3.5) p[i * 3] = -3.5;
      if (p[i * 3 + 1] < -2.25) p[i * 3 + 1] = 2.25;
    }
    attr.needsUpdate = true;
  });

  return <points ref={pts} geometry={geometry} material={material} />;
}

/* ---------------- Steam ---------------- */

const steamVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const steamFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }
  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.11 + uSeed * 10.0;
    float sway = (fbm(vec2(uv.y * 1.6 - t * 0.7, uSeed * 3.0)) - 0.5) * 0.7 * uv.y;
    float col = smoothstep(0.42, 0.0, abs(uv.x - 0.5 - sway));
    float n = fbm(vec2(uv.x * 2.4 + sway, uv.y * 1.8 - t * 1.6));
    float fadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.4, uv.y);
    float a = smoothstep(0.42, 0.82, n) * col * fadeY;
    gl_FragColor = vec4(vec3(1.0), a * uOpacity);
  }
`;

function Steam() {
  const group = useRef<THREE.Group>(null);
  const mats = useMemo(
    () =>
      [0.2, 1.7, 3.1].map(
        (seed) =>
          new THREE.ShaderMaterial({
            vertexShader: steamVert,
            fragmentShader: steamFrag,
            transparent: true,
            depthWrite: false,
            uniforms: { uTime: { value: 0 }, uSeed: { value: seed }, uOpacity: { value: 0.42 } },
          }),
      ),
    [],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  useFrame(({ clock, camera }) => {
    mats.forEach((m) => (m.uniforms.uTime.value = clock.elapsedTime));
    group.current?.children.forEach((c) => c.quaternion.copy(camera.quaternion));
  });
  return (
    <group ref={group}>
      {mats.map((m, i) => (
        <mesh key={i} material={m} position={[-0.35 + i * 0.35, 0.95 + i * 0.05, -0.1 + i * 0.05]}>
          <planeGeometry args={[0.8, 1.6]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Camera + motion rig ---------------- */

function Rig({ progress, pointer, still, onReady }: Pick<SceneProps, "progress" | "pointer" | "still" | "onReady">) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { viewport, camera, size } = useThree();
  const smoothP = useRef({ x: 0, y: 0, p: 0 });
  const intro = useRef(0);
  const readyFired = useRef(false);
  const portrait = size.height > size.width;

  // Fit: keep the croissant generous on desktop, full-width on phones
  const fit = portrait
    ? THREE.MathUtils.clamp(viewport.width / 2.45, 0.34, 0.9)
    : THREE.MathUtils.clamp(viewport.width / 4.9, 0.6, 1.02);

  useFrame(({ clock }, dt) => {
    const g = inner.current;
    const o = outer.current;
    if (!g || !o) return;
    const t = clock.elapsedTime;
    const s = smoothP.current;
    const k = 1 - Math.pow(0.001, Math.min(dt, 0.05));
    s.x += (pointer.current.x - s.x) * k * 0.6;
    s.y += (pointer.current.y - s.y) * k * 0.6;
    s.p += (progress.current - s.p) * k;
    intro.current = Math.min(1, intro.current + dt * 0.55);
    const e = 1 - Math.pow(1 - intro.current, 3);

    if (still) {
      g.rotation.set(0.18, -0.35, -0.05);
      o.position.set(0, portrait ? 0.05 : -0.12, 0);
      o.scale.setScalar(fit);
    } else {
      g.rotation.y = -0.32 + (1 - e) * -1.2 + Math.sin(t * 0.22) * 0.38 + s.p * Math.PI * 0.75 + s.x * 0.22;
      g.rotation.x = 0.2 - s.p * 0.28 + s.y * 0.08;
      g.rotation.z = -0.05 + s.x * 0.04;
      o.position.y = (portrait ? 0.2 : -0.12) + Math.sin(t * 0.9) * 0.035 + s.p * 0.55 - (1 - e) * 0.4;
      o.scale.setScalar(fit * (0.86 + 0.14 * e) * (1 + s.p * 0.12));

      camera.position.x = s.x * 0.35;
      camera.position.y = 1.35 + s.y * 0.18 - s.p * 0.35;
      camera.position.z = 4.6 - s.p * 0.9;
      camera.lookAt(0, 0.0 + s.p * 0.25, 0);
    }

    if (!readyFired.current) {
      readyFired.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Croissant still={still} />
      </group>
      {!still && <Steam />}
    </group>
  );
}

/* ---------------- Scene ---------------- */

export default function CroissantScene({ progress, pointer, active, onReady, onLost, still, quality = "high" }: SceneProps) {
  const low = quality === "low";
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={low ? [1, 1.25] : [1, 1.75]}
      frameloop={still || active ? "always" : "never"}
      camera={{ position: [0, 1.35, 4.6], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: !!still }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        camera.lookAt(0, 0, 0);
        gl.domElement.addEventListener("webglcontextlost", () => onLost?.(), { once: true });
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={["#fff1dc", "#7a4a22", 0.75]} />
      <directionalLight position={[-3, 4.5, 3]} intensity={3.1} color="#ffd8a6" />
      <directionalLight position={[3.2, 2, -3]} intensity={2.4} color="#fff4e6" />
      <pointLight position={[0, -0.6, 3]} intensity={0.8} color="#ffe2bd" />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.6} color="#fff3e0" position={[-4, 5, 2]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#ffd29a" position={[4, 2, 3]} scale={[3, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 3, -5]} scale={3} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.5} color="#c98a4a" position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
      </Environment>

      <Rig progress={progress} pointer={pointer} still={still} onReady={onReady} />

      {!still && <Crumbs count={low ? 10 : 18} />}
      {!still && <FlourDust count={low ? 180 : 420} />}

      <ContactShadows
        position={[0, -0.62, 0]}
        opacity={0.5}
        scale={7}
        blur={2.8}
        far={1.6}
        resolution={low ? 256 : 512}
        color="#5a3214"
        frames={still ? 1 : Infinity}
      />
    </Canvas>
  );
}
