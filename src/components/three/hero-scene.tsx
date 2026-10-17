"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneContent } from "@/components/three/scene-content";
import {
  detectQuality,
  type QualityProfile,
} from "@/components/three/quality";
import { useInView } from "@/hooks/use-in-view";
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
    const targetX = pointer.x * 0.85 + progress * 1.2;
    const targetY = -pointer.y * 0.55 + progress * -0.6;

    camera.position.x += (targetX - camera.position.x) * 0.045;
    camera.position.y += (targetY - camera.position.y) * 0.045;
    camera.position.z = 6 - progress * 1.4;
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
        intensity={quality.tier === "high" ? 1.15 : 0.85}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.5}
        mipmapBlur
      />
      {quality.enableDof ? (
        <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.6} />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
    </EffectComposer>
  );
}

export default function HeroScene() {
  const { reduceMotion } = useApp();
  const [quality, setQuality] = useState<QualityProfile>(() => detectQuality());
  const [dpr, setDpr] = useState<number>(1);
  const scrollProgress = useRef(0);
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "120px",
  });

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

  // Pause rendering when the canvas scrolls out of view.
  const visible = inView;

  const [maxDpr] = useState(quality.dpr[1]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
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
          gl.toneMappingExposure = 1.05;
        }}
      >
        <PerformanceMonitor
          bounds={(refreshRate) =>
            refreshRate > 90 ? [50, 90] : [40, 58]
          }
          onIncline={() => setDpr(maxDpr)}
          onDecline={() => setDpr(1)}
          onFallback={() => setDpr(1)}
        >
          <Suspense fallback={null}>
            <SceneContent
              quality={quality}
              scrollProgress={scrollProgress}
            />
            <CameraRig scrollProgress={scrollProgress} />
            <Effects quality={quality} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
