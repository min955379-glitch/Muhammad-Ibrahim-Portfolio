"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useInView } from "@/hooks/use-in-view";
import { useApp } from "@/components/providers/app-providers";
import { useToast } from "@/components/providers/toast-provider";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

type Vec = { x: number; y: number };
type Entity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: "core" | "meteor";
  spin: number;
};

type LeaderboardRow = {
  id: number;
  nickname: string;
  score: number;
  cores: number;
};

const PLAYER_SPEED = 320;
const LASER_SPEED = 620;
const CORE_POINTS = 35;
const MAX_SHIELD = 3;

export function Arcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { reduceMotion, locale } = useApp();
  const { toast } = useToast();

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [cores, setCores] = useState(0);
  const [shield, setShield] = useState(MAX_SHIELD);
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(false);
  const [nickname, setNickname] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [saving, setSaving] = useState(false);

  const { ref: viewRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.05,
  });

  /* ------------------------- game internals ------------------------- */
  const player = useRef<Vec>({ x: 0.5, y: 0.82 });
  const velocity = useRef<Vec>({ x: 0, y: 0 });
  const keys = useRef<Record<string, boolean>>({});
  const entities = useRef<Entity[]>([]);
  const lasers = useRef<{ x: number; y: number }[]>([]);
  const particles = useRef<
    { x: number; y: number; vx: number; vy: number; life: number; color: string }[]
  >([]);
  const scoreRef = useRef(0);
  const coresRef = useRef(0);
  const shieldRef = useRef(MAX_SHIELD);
  const spawnTimer = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTime = useRef(0);
  const audioCtx = useRef<AudioContext | null>(null);
  const joy = useRef<Vec>({ x: 0, y: 0 });
  const joyActive = useRef(false);
  const fireHeld = useRef(false);

  const emit = useCallback(
    (count: number, color: string, x: number, y: number) => {
      if (reduceMotion) return;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 140;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
        });
      }
    },
    [reduceMotion],
  );

  const beep = useCallback(
    (frequency: number, duration = 0.06, type: OscillatorType = "square") => {
      if (!sound) return;
      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtx.current) audioCtx.current = new Ctor();
        const ctx = audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio unavailable */
      }
    },
    [sound],
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.max(360, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  const spawn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isMeteor = Math.random() < 0.62;
    entities.current.push({
      x: Math.random() * w,
      y: -40,
      vx: (Math.random() - 0.5) * 90,
      vy: isMeteor ? 130 + Math.random() * 130 : 70 + Math.random() * 60,
      r: isMeteor ? 16 + Math.random() * 16 : 12 + Math.random() * 8,
      kind: isMeteor ? "meteor" : "core",
      spin: (Math.random() - 0.5) * 3,
    });
  }, []);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    entities.current = [];
    lasers.current = [];
    particles.current = [];
    scoreRef.current = 0;
    coresRef.current = 0;
    shieldRef.current = MAX_SHIELD;
    player.current = { x: canvas.width / 2, y: canvas.height * 0.82 };
    velocity.current = { x: 0, y: 0 };
    spawnTimer.current = 0;
    setScore(0);
    setCores(0);
    setShield(MAX_SHIELD);
    setGameOver(false);
  }, []);

  const endGame = useCallback(() => {
    setRunning(false);
    setGameOver(true);
    setBest((current) => Math.max(current, scoreRef.current));
    beep(140, 0.4, "sawtooth");
  }, [beep]);

  /* --------------------------- game loop ---------------------------- */
  useEffect(() => {
    if (!running || paused || !inView) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    const loop = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const dt = Math.min(0.05, (time - lastTime.current) / 1000 || 0.016);
      lastTime.current = time;
      const w = canvas.width;
      const h = canvas.height;

      /* player movement */
      const keySpeed = PLAYER_SPEED * dt;
      const dirX =
        (keys.current.ArrowRight || keys.current.KeyD ? 1 : 0) -
        (keys.current.ArrowLeft || keys.current.KeyA ? 1 : 0);
      const dirY =
        (keys.current.ArrowDown || keys.current.KeyS ? 1 : 0) -
        (keys.current.ArrowUp || keys.current.KeyW ? 1 : 0);

      const targetVX = (dirX + joy.current.x) * keySpeed;
      const targetVY = (dirY + joy.current.y) * keySpeed;
      velocity.current.x += (targetVX - velocity.current.x) * 0.35;
      velocity.current.y += (targetVY - velocity.current.y) * 0.35;

      player.current.x += velocity.current.x;
      player.current.y += velocity.current.y;
      player.current.x = Math.max(26, Math.min(w - 26, player.current.x));
      player.current.y = Math.max(60, Math.min(h - 26, player.current.y));

      /* firing */
      const wantsFire =
        fireHeld.current || keys.current.Space || keys.current.KeyJ;
      if (wantsFire && lasers.current.length < 3) {
        lasers.current.push({
          x: player.current.x,
          y: player.current.y - 22,
        });
        beep(880, 0.04, "sawtooth");
      }

      /* spawn */
      spawnTimer.current -= dt;
      if (spawnTimer.current <= 0) {
        spawnTimer.current = Math.max(0.34, 0.85 - scoreRef.current / 2600);
        spawn();
      }

      /* update entities */
      for (let i = entities.current.length - 1; i >= 0; i -= 1) {
        const entity = entities.current[i];
        entity.x += entity.vx * dt;
        entity.y += entity.vy * dt;
        entity.spin += dt;

        if (entity.y > h + 60) {
          entities.current.splice(i, 1);
          continue;
        }

        const dx = entity.x - player.current.x;
        const dy = entity.y - player.current.y;
        const distance = Math.hypot(dx, dy);

        if (entity.kind === "core" && distance < entity.r + 16) {
          entities.current.splice(i, 1);
          scoreRef.current += CORE_POINTS;
          coresRef.current += 1;
          setScore(scoreRef.current);
          setCores(coresRef.current);
          emit(14, "#F59E0B", entity.x, entity.y);
          beep(660, 0.07, "triangle");
          continue;
        }

        if (entity.kind === "meteor" && distance < entity.r + 15) {
          entities.current.splice(i, 1);
          shieldRef.current -= 1;
          setShield(Math.max(0, shieldRef.current));
          emit(20, "#F43F5E", entity.x, entity.y);
          beep(180, 0.18, "sawtooth");
          if (shieldRef.current <= 0) {
            endGame();
            return;
          }
        }
      }

      /* lasers */
      for (let i = lasers.current.length - 1; i >= 0; i -= 1) {
        const laser = lasers.current[i];
        laser.y -= LASER_SPEED * dt;
        if (laser.y < -20) {
          lasers.current.splice(i, 1);
          continue;
        }
        for (let j = entities.current.length - 1; j >= 0; j -= 1) {
          const entity = entities.current[j];
          if (
            Math.abs(entity.x - laser.x) < entity.r + 5 &&
            Math.abs(entity.y - laser.y) < entity.r + 8
          ) {
            entities.current.splice(j, 1);
            lasers.current.splice(i, 1);
            if (entity.kind === "core") {
              scoreRef.current += CORE_POINTS;
              coresRef.current += 1;
              setScore(scoreRef.current);
              setCores(coresRef.current);
              emit(10, "#F59E0B", entity.x, entity.y);
            } else {
              scoreRef.current += 5;
              setScore(scoreRef.current);
              emit(10, "#F43F5E", entity.x, entity.y);
            }
            break;
          }
        }
      }

      /* particles */
      for (let i = particles.current.length - 1; i >= 0; i -= 1) {
        const p = particles.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 120 * dt;
        p.life -= dt * 1.6;
        if (p.life <= 0) particles.current.splice(i, 1);
      }

      /* draw */
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(11,16,32,0.95)");
      bg.addColorStop(1, "rgba(4,6,14,0.98)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      const gridSize = 44 * (window.devicePixelRatio || 1);
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      for (const entity of entities.current) {
        if (entity.kind === "core") {
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(entity.spin);
          ctx.fillStyle = "#F59E0B";
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (let i = 0; i < 8; i += 1) {
            const angle = (Math.PI / 4) * i;
            const radius = i % 2 === 0 ? entity.r : entity.r * 0.55;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(entity.spin);
          ctx.fillStyle = "#F43F5E";
          ctx.shadowColor = "#F43F5E";
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(0, 0, entity.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(4,6,14,0.45)";
          ctx.beginPath();
          ctx.arc(-entity.r * 0.3, -entity.r * 0.3, entity.r * 0.28, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.shadowBlur = 12;
      ctx.fillStyle = "#38BDF8";
      for (const laser of lasers.current) {
        ctx.shadowColor = "#38BDF8";
        ctx.fillRect(laser.x - 2.5, laser.y - 12, 5, 16);
      }
      ctx.shadowBlur = 0;

      for (const p of particles.current) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      }
      ctx.globalAlpha = 1;

      /* player */
      ctx.save();
      ctx.translate(player.current.x, player.current.y);
      ctx.fillStyle = "#EAEEFB";
      ctx.shadowColor = "#6366F1";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(18, 18);
      ctx.lineTo(0, 10);
      ctx.lineTo(-18, 18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [running, paused, inView, spawn, beep, emit, endGame]);

  /* --------------------------- lifecycle ---------------------------- */
  useEffect(() => {
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resize]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === " "
      ) {
        if (document.activeElement?.tagName === "INPUT") return;
        event.preventDefault();
      }
      keys.current[event.code] = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("mi-arcade-best") ?? 0);
    if (stored > 0) {
      const raf = requestAnimationFrame(() => setBest(stored));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (best > 0) {
      try {
        window.localStorage.setItem("mi-arcade-best", String(best));
      } catch {
        /* storage unavailable */
      }
    }
  }, [best]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = (await response.json()) as { scores: LeaderboardRow[] };
      setLeaderboard(data.scores ?? []);
    } catch {
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadLeaderboard();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLeaderboard]);

  async function saveScore() {
    const name = nickname.trim();
    if (name.length < 2) {
      toast("Add a nickname (2–18 characters) first", "download");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: name,
          score,
          cores,
          durationSec: 0,
          locale,
        }),
      });
      if (!response.ok) throw new Error("failed");
      toast("Score saved to the leaderboard");
      void loadLeaderboard();
    } catch {
      toast("Could not save the score", "download");
    } finally {
      setSaving(false);
    }
  }

  function startMission() {
    reset();
    setRunning(true);
    setPaused(false);
    lastTime.current = performance.now();
  }

  function hyperWarp() {
    if (!running) {
      startMission();
      return;
    }
    scoreRef.current += 100;
    setScore(scoreRef.current);
    entities.current = entities.current.filter(
      (entity) => entity.kind !== "meteor",
    );
    emit(30, "#38BDF8", player.current.x, player.current.y);
    beep(1200, 0.2, "sine");
  }

  /* ------------------------- virtual controls ----------------------- */
  const joyRef = useRef<HTMLDivElement>(null);

  function handleJoyMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = joyRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const max = rect.width / 2;
    const length = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(length, max);
    joy.current = {
      x: (dx / length) * (clamped / max),
      y: (dy / length) * (clamped / max),
    };
  }

  const stateLabel = gameOver
    ? "MISSION ENDED"
    : paused
      ? "PAUSED"
      : running
        ? "IN MISSION"
        : "READY";

  return (
    <Section id="arcade" tone="deep">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="07 // INTERACTIVE 60FPS SPACE ARCADE"
            label="Arcade"
            title="Cyber-Nova Interceptor"
            subtitle="Touch and drag to steer, tap to fire twin plasma lasers, or use Arrow/AD keys."
            accent="rose"
          />
        </Reveal>

        <div ref={viewRef} className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          {/* Game */}
          <Reveal>
            <div className="glass overflow-hidden rounded-[24px] p-4 sm:p-5">
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: "Score", value: pad(score, 4) },
                  { label: "Cores", value: pad(cores, 2) },
                  {
                    label: "Shield",
                    value:
                      shield > 0
                        ? `${shield} / ${MAX_SHIELD}`
                        : "DOWN",
                  },
                  { label: "Best", value: pad(best, 4) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2.5"
                  >
                    <p className="font-mono text-[9.5px] tracking-[0.16em] text-[var(--text-3)]">
                      {item.label.toUpperCase()}
                    </p>
                    <p className="mt-1 font-mono text-[15px] font-bold tnum text-[var(--text)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                ref={wrapperRef}
                className="relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-[18px] border border-[var(--glass-border)] bg-[#05070f] sm:aspect-[16/11]"
              >
                <canvas
                  ref={canvasRef}
                  className="block h-full w-full"
                  aria-label="Cyber-Nova Interceptor game canvas"
                  role="img"
                />

                <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] tracking-[0.18em] text-white/50">
                  60FPS CANVAS ENGINE
                </div>

                <AnimatePresence>
                  {!running ? (
                    <motion.div
                      key="overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 grid place-items-center bg-[rgba(4,6,14,0.78)] backdrop-blur-sm"
                    >
                      <div className="px-6 text-center">
                        <p className="font-mono text-[11px] tracking-[0.24em] text-[var(--sky)]">
                          {stateLabel}
                        </p>
                        <h3 className="mt-2 font-display text-[22px] font-bold text-white">
                          Cyber-Nova Arcade
                        </h3>
                        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-white/70">
                          Touch and drag to steer, tap to fire. Collect Gold
                          Cores (+35 pts) and dodge Crimson Meteors!
                        </p>
                        <button
                          type="button"
                          onClick={startMission}
                          className="btn btn-primary mt-4 min-h-[48px] w-full max-w-[220px] justify-center rounded-[14px] text-[14px]"
                        >
                          {gameOver ? "Play again ↗" : "Start Mission ↗"}
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {paused && running ? (
                  <div className="absolute inset-0 grid place-items-center bg-[rgba(4,6,14,0.7)]">
                    <p className="font-mono text-[12px] tracking-[0.24em] text-white/80">
                      PAUSED
                    </p>
                  </div>
                ) : null}

                {/* Touch controls */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:hidden">
                  <div
                    ref={joyRef}
                    onPointerDown={(event) => {
                      joyActive.current = true;
                      handleJoyMove(event);
                    }}
                    onPointerMove={(event) => {
                      if (joyActive.current) handleJoyMove(event);
                    }}
                    onPointerUp={() => {
                      joyActive.current = false;
                      joy.current = { x: 0, y: 0 };
                    }}
                    onPointerCancel={() => {
                      joyActive.current = false;
                      joy.current = { x: 0, y: 0 };
                    }}
                    className="pointer-events-auto relative h-24 w-24 touch-none rounded-full border border-[var(--glass-border-strong)] bg-[rgba(255,255,255,0.06)]"
                    role="application"
                    aria-label="Virtual joystick — drag to steer"
                  >
                    <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-grad)] opacity-80" />
                  </div>

                  <button
                    type="button"
                    onPointerDown={() => {
                      fireHeld.current = true;
                    }}
                    onPointerUp={() => {
                      fireHeld.current = false;
                    }}
                    onPointerCancel={() => {
                      fireHeld.current = false;
                    }}
                    aria-label="Fire laser"
                    className="pointer-events-auto grid h-20 w-20 place-items-center rounded-full border border-[var(--glass-border-strong)] text-[11px] font-bold tracking-[0.1em] text-white"
                    style={{ background: "var(--download-grad)" }}
                  >
                    FIRE
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startMission}
                  className="btn btn-primary min-h-[44px] flex-1 justify-center rounded-[13px] text-[13px] sm:flex-none sm:px-5"
                >
                  {running ? "Restart" : "Start Mission"} ↗
                </button>
                <button
                  type="button"
                  onClick={hyperWarp}
                  className="btn btn-ghost min-h-[44px] flex-1 justify-center rounded-[13px] text-[13px] sm:flex-none sm:px-5"
                >
                  Hyper-Warp Dash
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-pressed={paused}
                  className="btn btn-ghost min-h-[44px] flex-1 justify-center rounded-[13px] text-[13px] sm:flex-none sm:px-5"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={() => setSound((value) => !value)}
                  aria-pressed={sound}
                  className="btn btn-ghost min-h-[44px] flex-1 justify-center rounded-[13px] text-[13px] sm:flex-none sm:px-5"
                >
                  Sound: {sound ? "On" : "Off"}
                </button>
              </div>

              <p className="mt-3 text-center text-[12px] text-[var(--text-3)] sm:text-left">
                Tap to Fire Laser · Arrow keys or WASD to steer · Space to fire
              </p>
            </div>
          </Reveal>

          {/* Leaderboard */}
          <Reveal delay={1}>
            <div className="glass flex h-full flex-col rounded-[24px] p-5">
              <p className="eyebrow text-[var(--rose)]">Leaderboard</p>
              <h3 className="mt-2.5 font-display text-[19px] font-bold text-[var(--text)]">
                Top anonymous scores
              </h3>

              {leaderboard.length === 0 ? (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-3)]">
                  No scores recorded yet. Finish a run and save it — nicknames
                  only, no accounts, no e-mail.
                </p>
              ) : (
                <ol className="mt-4 flex flex-col gap-2">
                  {leaderboard.map((row, index) => (
                    <li
                      key={row.id}
                      className="flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2.5"
                    >
                      <span className="font-mono text-[12px] font-bold text-[var(--text-3)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--text)]">
                        {row.nickname}
                      </span>
                      <span className="font-mono text-[12.5px] tnum text-[var(--amber)]">
                        {row.score}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-5 border-t border-[var(--glass-border)] pt-4">
                <label
                  htmlFor="nickname"
                  className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                >
                  Save your run
                </label>
                <input
                  id="nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={18}
                  placeholder="Nickname"
                  className="min-h-[46px] w-full rounded-[13px] border border-[var(--glass-border)] bg-[var(--bg-deep)] px-4 text-[14px] text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--sky)]"
                />
                <button
                  type="button"
                  onClick={saveScore}
                  disabled={saving || score === 0}
                  className="btn btn-ghost mt-2.5 min-h-[46px] w-full justify-center rounded-[13px] text-[13px] disabled:opacity-45"
                >
                  {saving ? "Saving…" : `Submit score (${score})`}
                </button>
                <p
                  className={cn(
                    "mt-3 text-[11.5px] leading-relaxed text-[var(--text-3)]",
                  )}
                >
                  Scores are stored anonymously with the nickname you choose.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </Section>
  );
}
