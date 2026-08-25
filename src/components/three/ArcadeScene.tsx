"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

/**
 * A scroll-driven arcade run, fixed behind the whole page.
 *
 * Scrolling flies the camera down a neon corridor: an infinite grid floor and
 * ceiling, a sliced synthwave sun on the horizon, and wireframe obstacles you
 * pass at intervals. Everything animates from `scrollState`, which is mutated
 * by a listener rather than held in React state — a 60fps scene must not
 * re-render the component tree.
 */

const VOID = "#05030f";
const CYAN = new THREE.Color("#22e8ff");
const MAGENTA = new THREE.Color("#ff3d9a");
const LIME = new THREE.Color("#a8ff3e");
const VIOLET = new THREE.Color("#a06bff");
const GOLD = new THREE.Color("#ffc93c");

/** How far the camera travels along -Z over a full-page scroll. */
const TRACK = 260;
/** Grid cell size — snapping to this makes the infinite floor seamless. */
const CELL = 4;

/* -------------------------------------------------------------------------- */
/*                              Infinite corridor                              */
/* -------------------------------------------------------------------------- */

function Corridor() {
  const floor = useRef<THREE.GridHelper>(null);
  const ceiling = useRef<THREE.GridHelper>(null);

  // gridHelper bakes colours into vertex attributes, so opacity has to be set
  // on the material after construction.
  useEffect(() => {
    [floor.current, ceiling.current].forEach((g) => {
      if (!g) return;
      const m = g.material as THREE.LineBasicMaterial;
      m.transparent = true;
      m.opacity = 0.42;
      m.depthWrite = false;
    });
  }, []);

  useFrame(({ camera }) => {
    // Snap each grid to the nearest cell boundary ahead of the camera. The
    // lines land in the same world positions every frame, so the floor reads
    // as genuinely infinite instead of visibly sliding.
    const snapped = Math.floor(camera.position.z / CELL) * CELL;
    if (floor.current) floor.current.position.z = snapped;
    if (ceiling.current) ceiling.current.position.z = snapped;
  });

  return (
    <>
      <gridHelper
        ref={floor}
        args={[400, 100, "#22e8ff", "#2a1f5c"]}
        position={[0, -4, 0]}
      />
      <gridHelper
        ref={ceiling}
        args={[400, 100, "#ff3d9a", "#2a1f5c"]}
        position={[0, 12, 0]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sliced synthwave sun                            */
/* -------------------------------------------------------------------------- */

function Sun() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    // Parked far ahead of the camera so it never gets reached.
    if (group.current) group.current.position.z = camera.position.z - 150;
  });

  const bars = useMemo(() => [-1.5, -3.4, -5.6, -8.2, -11.2], []);

  return (
    <group ref={group} position={[0, 2, -150]}>
      <mesh>
        <circleGeometry args={[22, 64]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.32} fog={false} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[15, 64]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.22} fog={false} />
      </mesh>
      {/* Horizontal slits — the detail that makes it read as synthwave. */}
      {bars.map((y, i) => (
        <mesh key={y} position={[0, y, 0.2]}>
          <planeGeometry args={[48, 0.5 + i * 0.32]} />
          <meshBasicMaterial color={VOID} fog={false} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Starfield                                  */
/* -------------------------------------------------------------------------- */

function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 90 + 4;
      pos[i * 3 + 2] = -Math.random() * (TRACK + 220);

      const t = Math.random();
      tmp.copy(t < 0.5 ? CYAN : t < 0.82 ? VIOLET : MAGENTA);
      tmp.multiplyScalar(0.5 + Math.random() * 0.5);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    return [pos, col] as const;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Obstacles along the run                          */
/* -------------------------------------------------------------------------- */

type ObstacleKind = "icosa" | "torus" | "octa" | "box";

const OBSTACLES: {
  kind: ObstacleKind;
  z: number;
  x: number;
  y: number;
  scale: number;
  color: THREE.Color;
  spin: number;
}[] = [
  { kind: "icosa", z: -26, x: -9, y: 2, scale: 2.4, color: CYAN, spin: 0.35 },
  { kind: "torus", z: -58, x: 10, y: 5, scale: 2.1, color: MAGENTA, spin: -0.3 },
  { kind: "octa", z: -92, x: -11, y: 6, scale: 2.6, color: LIME, spin: 0.42 },
  { kind: "box", z: -126, x: 9, y: 1, scale: 2.0, color: VIOLET, spin: -0.26 },
  { kind: "icosa", z: -160, x: -8, y: 5, scale: 2.3, color: GOLD, spin: 0.31 },
  { kind: "torus", z: -196, x: 11, y: 3, scale: 2.5, color: CYAN, spin: -0.36 },
  { kind: "octa", z: -232, x: -10, y: 6, scale: 2.2, color: MAGENTA, spin: 0.4 },
];

function Obstacle({ data }: { data: (typeof OBSTACLES)[number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * data.spin * 0.6;
    ref.current.rotation.y += delta * data.spin;
  });

  return (
    <mesh ref={ref} position={[data.x, data.y, data.z]} scale={data.scale}>
      {data.kind === "icosa" ? (
        <icosahedronGeometry args={[1, 0]} />
      ) : data.kind === "torus" ? (
        <torusGeometry args={[1, 0.34, 10, 28]} />
      ) : data.kind === "octa" ? (
        <octahedronGeometry args={[1, 0]} />
      ) : (
        <boxGeometry args={[1.4, 1.4, 1.4]} />
      )}
      <meshBasicMaterial
        color={data.color}
        wireframe
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                            The player-side core                             */
/* -------------------------------------------------------------------------- */

function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const tint = useMemo(() => new THREE.Color(), []);

  useFrame(({ camera }, delta) => {
    const p = scrollState.progress;

    if (group.current) {
      // Rides just ahead of the camera like a ship in a rail shooter.
      group.current.position.z = camera.position.z - 11;
      group.current.position.x = scrollState.pointerX * 1.6;
      group.current.position.y = 3.2 - scrollState.pointerY * 1.1;
    }

    if (outer.current) {
      outer.current.rotation.y += delta * 0.5;
      outer.current.rotation.x += delta * 0.22;
      // Scroll velocity makes it flinch — the scene feels connected to input.
      const kick = Math.min(0.5, Math.abs(scrollState.velocity) * 0.006);
      outer.current.scale.setScalar(1 + kick);

      // Hue walks cyan → violet → magenta → lime across the run.
      const stops = [CYAN, VIOLET, MAGENTA, LIME];
      const seg = Math.min(stops.length - 2, Math.floor(p * (stops.length - 1)));
      const local = p * (stops.length - 1) - seg;
      tint.copy(stops[seg]).lerp(stops[seg + 1], local);
      (outer.current.material as THREE.MeshBasicMaterial).color.copy(tint);
    }

    if (inner.current) {
      inner.current.rotation.y -= delta * 0.75;
      inner.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color={CYAN}
          wireframe
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={inner} scale={0.62}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={MAGENTA}
          wireframe
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Camera rig                                  */
/* -------------------------------------------------------------------------- */

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 4, 8));

  useFrame((_, delta) => {
    const p = scrollState.progress;

    // Scroll flies the camera down the corridor.
    target.current.set(
      scrollState.pointerX * 2.2,
      4 - scrollState.pointerY * 1.2 + Math.sin(p * Math.PI * 3) * 0.7,
      8 - p * TRACK,
    );

    const damp = Math.min(1, delta * 3.2);
    camera.position.lerp(target.current, damp);
    camera.lookAt(
      scrollState.pointerX * 1.2,
      3.6,
      camera.position.z - 24,
    );
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*                                    Scene                                    */
/* -------------------------------------------------------------------------- */

function Scene({ starCount }: { starCount: number }) {
  return (
    <>
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 26, 135]} />

      <CameraRig />
      <Corridor />
      <Sun />
      <Stars count={starCount} />
      <Core />

      {OBSTACLES.map((o, i) => (
        <Obstacle key={i} data={o} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Canvas                                    */
/* -------------------------------------------------------------------------- */

export default function ArcadeScene() {
  const [dpr, setDpr] = useState(1.5);

  const starCount = useMemo(() => {
    if (typeof window === "undefined") return 700;
    return window.innerWidth < 768 ? 420 : 1100;
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 4, 8], fov: 62, far: 400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.75)}
      />
      <Suspense fallback={null}>
        <Scene starCount={starCount} />
      </Suspense>
    </Canvas>
  );
}
