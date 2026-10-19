"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneContent } from "@/components/three/scene-content";
import {
  detectQuality,
  type QualityProfile,
} from "@/components/three/quality";

import { useApp } from "@/components/providers/app-providers";

/** Camera rig — reacts to scroll and to pointer parallax. */
function CameraRig({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { camera, pointer } = useThree();

  useFrame((state) => {
    const progress = scrollProgress.current;
    const targetX = pointer.x * 0.06;
    const targetY = -pointer.y * 0.04;

    camera.position.x += (targetX - camera.position.x) * 0.045;
    camera.position.y += (targetY - camera.position.y) * 0.045;
    camera.position.z = 6;
    camera.lookAt(0, 0, 0);

    if (state.clock.elapsedTime % 1 < 0.02) {
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/** Post-processing stack, tuned per quality tier. */
function Effects({ quality }: { quality: QualityProfile }) {
  if (!quality.enableBloom) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.88}
        luminanceSmoothing={0.15}
        mipmapBlur
      />
    </EffectComposer>
  );
}


/** Two-second sustained FPS check: remove bloom below 50, then WebGL below 45. */
function FpsGuard({ onSlow, onBelow50, tracker }: {
  onSlow: () => void;
  onBelow50: () => void;
  tracker: React.MutableRefObject<{ elapsed: number; frames: number }>;
}) {
  useFrame((_, delta) => {
    tracker.current.elapsed += delta;
    tracker.current.frames += 1;
    if (tracker.current.elapsed < 2) return;
    const fps = tracker.current.frames / tracker.current.elapsed;
    tracker.current = { elapsed: 0, frames: 0 };
    if (fps < 45) onSlow();
    else if (fps < 50) onBelow50();
  });
  return null;
}

export default function HeroScene() {
  const { reduceMotion } = useApp();
  const [quality, setQuality] = useState<QualityProfile>(() => detectQuality());
  const [dpr, setDpr] = useState<number>(1);
  const scrollProgress = useRef(0);
  const [visible, setVisible] = useState(true);
  const [fallback, setFallback] = useState(false);
  const fpsWindow = useRef({ elapsed: 0, frames: 0 });
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollProgress.current = Math.min(1, window.scrollY / max);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const [maxDpr] = useState(quality.dpr[1]);

  if (fallback) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        frameloop={visible && !reduceMotion ? "always" : "demand"}
        gl={{
          antialias: quality.antialias,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 60 }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#04060e"), 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.7;
        }}
      >
        <PerformanceMonitor
          bounds={(refreshRate) =>
            refreshRate > 90 ? [50, 90] : [40, 58]
          }
          onIncline={() => setDpr(maxDpr)}
          onDecline={() => {
            setDpr(1);
            setQuality((current) => ({ ...current, enableBloom: false }));
          }}
          onFallback={() => setFallback(true)}
        >
          <Suspense fallback={null}>
            <SceneContent
              quality={quality}
              scrollProgress={scrollProgress}
            />
            <CameraRig scrollProgress={scrollProgress} />
            <FpsGuard onSlow={() => setFallback(true)} onBelow50={() => setQuality((current) => ({ ...current, enableBloom: false }))} tracker={fpsWindow} />
            <Effects quality={quality} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
