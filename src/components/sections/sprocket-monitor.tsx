"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

type RigState = "idle" | "wave" | "walk" | "jump-spin";

const STATE_META: Record<RigState, { label: string; caption: string }> = {
  idle: { label: "IDLE", caption: "Sprocket 720x1280 — Idle" },
  wave: { label: "WAVE", caption: "Sprocket 720x1280 — Wave" },
  walk: { label: "WALK", caption: "Sprocket 720x1280 — Walk" },
  "jump-spin": { label: "JUMP-SPIN", caption: "Sprocket 720x1280 — Jump-Spin" },
};

/**
 * "Render monitor" for the Sprocket clay rig.
 *
 * If a real rendered clip is available at /videos/sprocket-<state>.mp4 it
 * is autoplayed inside the monitor. Otherwise the monitor falls back to a
 * procedural canvas preview of the same rig, with a wireframe-to-render
 * reveal toggle. Nothing about the published Blender scene spec changes.
 */
export function SprocketMonitor({
  state,
  wireframe,
}: {
  state: RigState;
  wireframe: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | null>(null);
  const { reduceMotion } = useApp();
  const [videoFailed, setVideoFailed] = useState(false);

  const draw = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const t = reduceMotion ? 0 : time / 1000;
      let bob = 0;
      let armLeft = 0.35;
      let armRight = -0.35;
      let legLeft = 0;
      let legRight = 0;
      let spin = 0;
      let jump = 0;

      if (state === "idle") {
        bob = Math.sin(t * 1.6) * 4;
        armLeft = 0.32 + Math.sin(t * 1.6) * 0.08;
        armRight = -0.32 - Math.sin(t * 1.6) * 0.08;
      } else if (state === "wave") {
        bob = Math.sin(t * 2.2) * 3;
        armRight = -2.3 + Math.sin(t * 7) * 0.32;
        armLeft = 0.3;
      } else if (state === "walk") {
        bob = Math.abs(Math.sin(t * 6)) * 6 - 3;
        legLeft = Math.sin(t * 6) * 0.62;
        legRight = -Math.sin(t * 6) * 0.62;
        armLeft = -legLeft * 0.7;
        armRight = -legRight * 0.7;
      } else {
        spin = t * 5.2;
        jump = Math.abs(Math.sin(t * 2.6)) * -46;
        armLeft = 0.9 + Math.sin(t * 5.2) * 0.3;
        armRight = -0.9 - Math.sin(t * 5.2) * 0.3;
      }

      const cx = width / 2;
      const cy = height / 2 + bob + jump;
      const scale = Math.min(width, height) / 340;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.rotate(spin);

      const clay = ctx.createLinearGradient(-60, -120, 60, 120);
      clay.addColorStop(0, "#E8B98C");
      clay.addColorStop(0.45, "#C9895A");
      clay.addColorStop(1, "#8A5334");

      const fill = (path: () => void) => {
        path();
        if (wireframe) {
          ctx.strokeStyle = "rgba(56,189,248,0.95)";
          ctx.lineWidth = 1.6;
          ctx.stroke();
        } else {
          ctx.fillStyle = clay;
          ctx.fill();
          ctx.strokeStyle = "rgba(4,6,14,0.45)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      };

      // Legs
      const drawLeg = (angle: number, offsetX: number) => {
        ctx.save();
        ctx.translate(offsetX, 44);
        ctx.rotate(angle);
        fill(() => {
          ctx.beginPath();
          ctx.roundRect(-11, 0, 22, 52, 10);
        });
        ctx.restore();
      };
      drawLeg(legLeft, -20);
      drawLeg(legRight, 20);

      // Body
      fill(() => {
        ctx.beginPath();
        ctx.roundRect(-46, -44, 92, 92, 26);
      });

      // Chest plate
      if (!wireframe) {
        ctx.fillStyle = "rgba(4,6,14,0.24)";
        ctx.beginPath();
        ctx.roundRect(-26, -22, 52, 40, 14);
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(56,189,248,0.7)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.roundRect(-26, -22, 52, 40, 14);
        ctx.stroke();
      }

      // Arms
      const drawArm = (angle: number, offsetX: number) => {
        ctx.save();
        ctx.translate(offsetX, -18);
        ctx.rotate(angle);
        fill(() => {
          ctx.beginPath();
          ctx.roundRect(-11, 0, 22, 56, 10);
        });
        ctx.restore();
      };
      drawArm(armLeft, -56);
      drawArm(armRight, 56);

      // Head
      fill(() => {
        ctx.beginPath();
        ctx.roundRect(-40, -122, 80, 66, 24);
      });

      // Eyes
      if (!wireframe) {
        ctx.fillStyle = "#0A1020";
        ctx.beginPath();
        ctx.arc(-16, -92, 9, 0, Math.PI * 2);
        ctx.arc(16, -92, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(-13, -95, 3, 0, Math.PI * 2);
        ctx.arc(19, -95, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(56,189,248,0.95)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(-16, -92, 9, 0, Math.PI * 2);
        ctx.arc(16, -92, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Antenna
      ctx.strokeStyle = wireframe ? "rgba(56,189,248,0.95)" : "#8A5334";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -122);
      ctx.lineTo(0, -140);
      ctx.stroke();
      ctx.fillStyle = wireframe ? "rgba(56,189,248,0.95)" : "#F59E0B";
      ctx.beginPath();
      ctx.arc(0, -146, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ground shadow
      if (!wireframe) {
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.ellipse(cx, height - 26, 54 * scale, 9 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [state, wireframe, reduceMotion],
  );

  useEffect(() => {
    if (videoFailed) {
      const loop = (time: number) => {
        draw(time);
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
      return () => {
        if (raf.current) cancelAnimationFrame(raf.current);
      };
    }
    return undefined;
  }, [draw, videoFailed]);

  return (
    <div className="relative aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[20px] border border-[var(--glass-border-strong)] bg-[#05070f]">
      {videoFailed ? (
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          aria-label={`${STATE_META[state].caption} — procedural rig preview`}
        />
      ) : (
        <video
          key={state}
          className="h-full w-full object-cover"
          src={`/videos/sprocket-${state}.mp4`}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(4,6,14,0.6) 100%)",
        }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between px-3 pt-3 font-mono text-[9px] tracking-[0.16em] text-white/70">
        <span>SPROCKET_720x1280</span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: wireframe ? "var(--sky)" : "var(--amber)" }}
          />
          {wireframe ? "WIREFRAME" : "RENDER"}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#05070f] to-transparent px-3 pb-3 pt-8">
        <p className="font-mono text-[10px] tracking-[0.14em] text-white/80">
          {STATE_META[state].caption}
        </p>
      </div>
    </div>
  );
}

export function SprocketMonitorPanel() {
  const [state, setState] = useState<RigState>("idle");
  const [wireframe, setWireframe] = useState(false);

  const states: { id: RigState; label: string }[] = [
    { id: "idle", label: "01. Idle" },
    { id: "wave", label: "02. Wave" },
    { id: "walk", label: "03. Walk" },
    { id: "jump-spin", label: "04. Jump-Spin" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-[auto,minmax(0,1fr)] sm:items-center">
      <SprocketMonitor state={state} wireframe={wireframe} />

      <div>
        <div className="flex flex-wrap gap-1.5">
          {states.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setState(item.id)}
              aria-pressed={state === item.id}
              className={cn(
                "rounded-xl border px-3 py-2 font-mono text-[11px] tracking-[0.08em] transition-colors",
                state === item.id
                  ? "border-transparent bg-[var(--brand-grad)] text-white"
                  : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-3)] hover:text-[var(--text)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setWireframe((value) => !value)}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 text-[12.5px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--sky)]"
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: wireframe ? "var(--sky)" : "var(--amber)" }}
          />
          {wireframe ? "Show clay render" : "Show wireframe"}
        </button>

        <motion.p
          key={STATE_META[state].caption}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[var(--text-3)]"
        >
          {STATE_META[state].caption.toUpperCase()}
        </motion.p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--text-2)]">
          Drop the rendered clips at{" "}
          <code className="rounded bg-[var(--glass)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text)]">
            /public/videos/sprocket-&lt;state&gt;.mp4
          </code>{" "}
          and the monitor switches from the procedural rig preview to the
          real Cycles output automatically.
        </p>
      </div>
    </div>
  );
}
