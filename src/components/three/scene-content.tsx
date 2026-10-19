"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityProfile } from "@/components/three/quality";

type SceneContentProps = {
  quality: QualityProfile;
  scrollProgress: React.MutableRefObject<number>;
};

const KNOT_COLORS = ["#6366F1", "#A855F7", "#38BDF8"] as const;

/** The hero centrepiece: a glowing torus knot with a wireframe shell. */
function TechKnot({
  quality,
  scrollProgress,
}: SceneContentProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const geometry = useMemo(
    () => new THREE.TorusKnotGeometry(1.15, 0.32, 220, 32, 2, 3),
    [],
  );

  useFrame((state, delta) => {
    const groupRef = group.current;
    if (!groupRef) return;

    const t = state.clock.elapsedTime;
    const progress = scrollProgress.current;

    // Scroll morphs the knot and pushes it deeper into the page.
    groupRef.rotation.x = t * 0.14 + state.pointer.y * 0.32 + progress * 1.5;
    groupRef.rotation.y = t * 0.2 + state.pointer.x * 0.45 + progress * 2.2;
    // Keep the accent under 45% of the viewport, at the lower-right.
    const baseScale = Math.min(viewport.width * 0.13, viewport.height * 0.14);
    groupRef.scale.setScalar(baseScale * (1 + Math.sin(t * 0.8) * 0.025));
    groupRef.position.set(viewport.width * 0.23, -viewport.height * 0.25 - progress * 0.35, -2);

    if (core.current) {
      const material = core.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.13 + Math.sin(t * 1.6) * 0.03;
    }
    if (shell.current) {
      shell.current.rotation.z = -t * 0.12;
      const material = shell.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.19 + Math.sin(t * 1.1) * 0.02;
    }
  });

  return (
    <group ref={group} position={[viewport.width * 0.23, -viewport.height * 0.25, -2]} scale={Math.min(viewport.width * 0.13, viewport.height * 0.14)}>
      <mesh ref={core} geometry={geometry} castShadow={false} receiveShadow={false}>
        <meshStandardMaterial
          color="#1b2350"
          roughness={0.16}
          metalness={0.92}
          emissive="#6366F1"
          emissiveIntensity={0.13}
          flatShading={false}
        />
      </mesh>

      <mesh ref={shell} geometry={geometry} scale={1.12}>
        <meshBasicMaterial
          color="#A855F7"
          wireframe
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner crystal core */}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={0.24}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/** Drifting particle field. */
function Particles({
  count,
  color,
  spread = 9,
  speed = 0.16,
}: {
  count: number;
  color: string;
  spread?: number;
  speed?: number;
}) {
  const points = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    // Deterministic PRNG keeps the field stable across renders and SSR.
    let seed = (count * 7919 + 13) >>> 0;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * spread;
      positions[i * 3 + 1] = (random() - 0.5) * spread;
      positions[i * 3 + 2] = (random() - 0.5) * spread - 2;
      sizes[i] = random() * 0.06 + 0.02;
    }
    return { positions, sizes };
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * speed * 0.35;
    points.current.rotation.x += delta * speed * 0.12;
  });

  if (count === 0) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={sizes.length}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SceneContent(props: SceneContentProps) {
  const { quality } = props;

  return (
    <>
      <ambientLight intensity={0.18} color="#8ea2ff" />
      <directionalLight position={[4, 6, 5]} intensity={0.8} color="#cdd8ff" />
      <pointLight position={[-4, -2, 4]} intensity={1.8} color="#A855F7" distance={9} />
      <pointLight position={[3.5, 2.5, 3]} intensity={1.4} color="#38BDF8" distance={9} />
      <TechKnot {...props} />
      <Particles count={quality.tier === "high" ? quality.particles : 0} color="#A855F7" spread={11} />
      <Particles count={quality.tier === "high" ? quality.starCount : 0} color="#38BDF8" spread={16} speed={0.08} />
    </>
  );
}
