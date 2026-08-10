"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

/**
 * An armillary sphere rendered as thin lines — the kind of ornament an
 * encyclopaedia would set beside a masthead. Deliberately monochrome and
 * low-contrast: it should read as an engraving, never as a game asset.
 */

const INK = new THREE.Color("#e9e2d7");
const ACCENT = new THREE.Color("#e9a63c");

/** One great circle of the armillary. */
function Ring({
  radius,
  rotation,
  color,
  opacity,
  spin,
}: {
  radius: number;
  rotation: [number, number, number];
  color: THREE.Color;
  opacity: number;
  spin: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(180).map((p) => new THREE.Vector3(p.x, p.y, 0));
    // Dashes read as engraved hatching rather than a solid hoop.
    const segments: THREE.Vector3[] = [];
    for (let i = 0; i < points.length - 1; i += 2) {
      segments.push(points[i], points[i + 1]);
    }
    return new THREE.BufferGeometry().setFromPoints(segments);
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * spin;
  });

  return (
    <lineSegments ref={ref} rotation={rotation} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Latitude bands on the inner globe. */
function Globe({ detail }: { detail: number }) {
  const ref = useRef<THREE.Group>(null);

  const bands = useMemo(() => {
    const out: { radius: number; y: number }[] = [];
    const count = detail > 0.6 ? 11 : 7;
    for (let i = 1; i < count; i++) {
      const t = i / count;
      const phi = t * Math.PI;
      out.push({ radius: Math.sin(phi) * 1.15, y: Math.cos(phi) * 1.15 });
    }
    return out;
  }, [detail]);

  const meridians = useMemo(() => (detail > 0.6 ? 12 : 8), [detail]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.075;
  });

  return (
    <group ref={ref} rotation={[0.28, 0, 0.16]}>
      {bands.map((b, i) => (
        <mesh key={i} position={[0, b.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[b.radius, 0.0022, 6, 96]} />
          <meshBasicMaterial color={INK} transparent opacity={0.2} />
        </mesh>
      ))}

      {Array.from({ length: meridians }).map((_, i) => (
        <mesh key={`m${i}`} rotation={[0, (i / meridians) * Math.PI, 0]}>
          <torusGeometry args={[1.15, 0.0022, 6, 128]} />
          <meshBasicMaterial color={INK} transparent opacity={0.11} />
        </mesh>
      ))}

      {/* Axis */}
      <mesh>
        <cylinderGeometry args={[0.0035, 0.0035, 2.95, 6]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/** A slow pointer drift, so the ornament feels hand-set rather than static. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const damp = Math.min(1, delta * 1.6);
    group.current.rotation.y += (state.pointer.x * 0.2 - group.current.rotation.y) * damp;
    group.current.rotation.x += (-state.pointer.y * 0.14 - group.current.rotation.x) * damp;
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ detail }: { detail: number }) {
  return (
    <Rig>
      <Globe detail={detail} />
      <Ring radius={1.62} rotation={[1.45, 0.2, 0]} color={ACCENT} opacity={0.5} spin={0.09} />
      <Ring radius={1.88} rotation={[1.12, -0.4, 0.5]} color={INK} opacity={0.26} spin={-0.06} />
      <Ring radius={2.14} rotation={[1.55, 0.1, -0.3]} color={INK} opacity={0.16} spin={0.04} />
    </Rig>
  );
}

export default function MastheadCanvas() {
  const [dpr, setDpr] = useState(1.5);
  const [detail, setDetail] = useState(1);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setDetail(0.5);
        }}
        onIncline={() => setDpr(1.75)}
      />
      <Suspense fallback={null}>
        <Scene detail={detail} />
      </Suspense>
    </Canvas>
  );
}
