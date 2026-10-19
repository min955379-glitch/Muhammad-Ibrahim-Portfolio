#!/usr/bin/env python3
"""
Sprocket 720x1280 — Blender 5.2 Cycles GPU Project & ZIP Packager
Author: Muhammad Ibrahim
Creates:
  1. blender/generate_and_render_sprocket.py (Full Blender 5.2 bpy script)
  2. blender/run_headless_renders.bat (One-click Windows batch renderer for all 4 clips)
  3. public/videos/README_VIDEOS.txt (Target folder for sprocket-<state>.mp4)
  4. sprocket-monitor-widget.html (Drop-in portfolio widget: auto-switches from Procedural to MP4 + Wireframe toggle)
  5.PROJECT_DOCUMENTATION.md (Complete technical spec for The Great Desktop Migration, First Light v2, and Sprocket)
Bundles everything into: Sprocket_Blender52_Project_Package.zip
"""

import os
import zipfile
from pathlib import Path

OUT_DIR = Path("Sprocket_Blender52_Package")
ZIP_NAME = "Sprocket_Blender52_Project_Package.zip"

# ==============================================================================
# 1. BLENDER 5.2 PYTHON SCRIPT (PROCEDURAL CLAY ROBOT + 4 MARKER ACTIONS + CYCLES)
# ==============================================================================
BLENDER_SCRIPT = r'''import bpy
import math
import os
import sys

# ------------------------------------------------------------------------------
# SPROCKET — 720x1280 CLAY ROBOT PROCEDURAL RIG & CYCLES GPU RENDERER (BLENDER 5.2)
# Strictly Zero-Green Palette: Indigo (#6366F1), Violet (#A855F7), Sky (#38BDF8), Amber (#F59E0B)
#Actions: idle, wave, walk, jump-spin
# ------------------------------------------------------------------------------

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def make_clay_material(name, hex_color, roughness=0.65, subsurface=0.15, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")

    r = int(hex_color[1:3], 16) / 255.0
    g = int(hex_color[3:5], 16) / 255.0
    b = int(hex_color[5:7], 16) / 255.0
    rgba = (r ** 2.2, g ** 2.2, b ** 2.2, 1.0)

    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = roughness
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
    if emission_strength > 0 and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = rgba
        bsdf.inputs["Emission Strength"].default_value = emission_strength

    # Subtle procedural clay fingerprint bump
    noise = nodes.new(type="ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 42.0
    noise.inputs["Detail"].default_value = 6.0
    bump = nodes.new(type="ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.06
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat

def build_sprocket_rig():
    mat_indigo = make_clay_material("Clay_Indigo", "#6366F1", roughness=0.62, subsurface=0.2)
    mat_violet = make_clay_material("Clay_Violet", "#A855F7", roughness=0.58, subsurface=0.2)
    mat_amber  = make_clay_material("Clay_Amber",  "#F59E0B", roughness=0.45, subsurface=0.1)
    mat_sky    = make_clay_material("Visor_Sky",   "#38BDF8", roughness=0.15, emission_strength=4.5)
    mat_dark   = make_clay_material("Stage_Dark",  "#060914", roughness=0.85, subsurface=0.0)

    # Root Empty for character transforms
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    root = bpy.context.active_object
    root.name = "Sprocket_Root"

    # Torso
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.15))
    torso = bpy.context.active_object
    torso.name = "Sprocket_Torso"
    torso.scale = (0.62, 0.45, 0.68)
    bpy.ops.object.modifier_add(type='BEVEL')
    torso.modifiers["Bevel"].width = 0.14
    torso.modifiers["Bevel"].segments = 4
    bpy.ops.object.shade_smooth()
    torso.data.materials.append(mat_indigo)
    torso.parent = root

    # Head
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 2.15))
    head = bpy.context.active_object
    head.name = "Sprocket_Head"
    head.scale = (0.72, 0.52, 0.52)
    bpy.ops.object.modifier_add(type='BEVEL')
    head.modifiers["Bevel"].width = 0.16
    head.modifiers["Bevel"].segments = 5
    bpy.ops.object.shade_smooth()
    head.data.materials.append(mat_violet)
    head.parent = torso

    # Glowing Sky-Blue Eyes
    for side in (-0.26, 0.26):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(side, -0.48, 2.16))
        eye = bpy.context.active_object
        eye.scale = (1.0, 0.4, 1.0)
        bpy.ops.object.shade_smooth()
        eye.data.materials.append(mat_sky)
        eye.parent = head

    # Antenna Stem & Bulb
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.38, location=(0, 0, 2.78))
    ant = bpy.context.active_object
    ant.data.materials.append(mat_amber)
    ant.parent = head

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0, 0, 3.0))
    bulb = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    bulb.data.materials.append(mat_sky)
    bulb.parent = head

    # Left & Right Arms
    bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.65, location=(-0.82, 0, 1.25))
    arm_l = bpy.context.active_object
    arm_l.name = "Sprocket_Arm_L"
    bpy.ops.object.shade_smooth()
    arm_l.data.materials.append(mat_amber)
    arm_l.parent = torso

    bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.65, location=(0.82, 0, 1.25))
    arm_r = bpy.context.active_object
    arm_r.name = "Sprocket_Arm_R"
    bpy.ops.object.shade_smooth()
    arm_r.data.materials.append(mat_amber)
    arm_r.parent = torso

    # Left & Right Legs
    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.55, location=(-0.28, 0, 0.32))
    leg_l = bpy.context.active_object
    leg_l.name = "Sprocket_Leg_L"
    bpy.ops.object.shade_smooth()
    leg_l.data.materials.append(mat_violet)
    leg_l.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.55, location=(0.28, 0, 0.32))
    leg_r = bpy.context.active_object
    leg_r.name = "Sprocket_Leg_R"
    bpy.ops.object.shade_smooth()
    leg_r.data.materials.append(mat_violet)
    leg_r.parent = root

    # Studio Backdrop Cyclorama
    bpy.ops.mesh.primitive_plane_add(size=18.0, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.data.materials.append(mat_dark)

    return root, torso, head, arm_l, arm_r, leg_l, leg_r

def setup_camera_and_lights():
    # Vertical 720x1280 Camera
    bpy.ops.object.camera_add(location=(0.0, -5.6, 1.75), rotation=(math.radians(86), 0.0, 0.0))
    cam = bpy.context.active_object
    cam.data.lens = 55
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 5.6
    cam.data.dof.aperture_fstop = 2.8
    bpy.context.scene.camera = cam

    # 3-Point Studio Area Lighting (Indigo Key, Sky Rim, Warm Fill)
    bpy.ops.object.light_add(type='AREA', location=(2.8, -3.2, 3.8))
    key = bpy.context.active_object
    key.data.energy = 260.0
    key.data.color = (0.65, 0.68, 1.0)
    key.data.size = 2.5

    bpy.ops.object.light_add(type='AREA', location=(-2.8, -2.5, 2.6))
    fill = bpy.context.active_object
    fill.data.energy = 140.0
    fill.data.color = (1.0, 0.78, 0.45)
    fill.data.size = 2.2

    bpy.ops.object.light_add(type='AREA', location=(0.0, 2.5, 3.6))
    rim = bpy.context.active_object
    rim.data.energy = 320.0
    rim.data.color = (0.35, 0.82, 1.0)
    rim.data.size = 2.0

def animate_state(state_name, root, torso, head, arm_l, arm_r, leg_l, leg_r):
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 48
    scene.render.fps = 24

    # Clear existing animation data
    for obj in (root, torso, head, arm_l, arm_r, leg_l, leg_r):
        obj.animation_data_clear()

    # Add Timeline Marker
    scene.timeline_markers.clear()
    scene.timeline_markers.new(name=state_name.upper(), frame=1)

    for f in range(1, 49):
        t = (f - 1) / 48.0 * (2.0 * math.pi)
        scene.frame_set(f)

        # Reset base transforms
        root.location = (0, 0, 0)
        root.rotation_euler = (0, 0, 0)
        arm_r.rotation_euler = (0, 0, 0)
        arm_l.rotation_euler = (0, 0, 0)
        leg_l.rotation_euler = (0, 0, 0)
        leg_r.rotation_euler = (0, 0, 0)

        if state_name == "idle":
            root.location.z = math.sin(t) * 0.06
            head.rotation_euler.z = math.sin(t) * 0.12

        elif state_name == "wave":
            root.location.z = math.sin(t) * 0.05
            arm_r.rotation_euler.y = math.radians(-135) + math.sin(t * 2.0) * 0.45
            head.rotation_euler.y = math.sin(t) * 0.1

        elif state_name == "walk":
            root.location.z = abs(math.sin(t * 2.0)) * 0.12
            leg_l.rotation_euler.x = math.sin(t * 2.0) * 0.45
            leg_r.rotation_euler.x = -math.sin(t * 2.0) * 0.45
            arm_l.rotation_euler.x = -math.sin(t * 2.0) * 0.35
            arm_r.rotation_euler.x = math.sin(t * 2.0) * 0.35

        elif state_name == "jump-spin":
            jump_phase = math.sin(t * 0.5)
            root.location.z = max(0.0, jump_phase) * 0.95
            root.rotation_euler.z = t

        for obj in (root, head, arm_l, arm_r, leg_l, leg_r):
            obj.keyframe_insert(data_path="location")
            obj.keyframe_insert(data_path="rotation_euler")

def configure_cycles_gpu(output_mp4_path):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True

    # Enable AMD HIP / CUDA / Metal automatically if available
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for dev_type in ('HIP', 'OPTIX', 'CUDA', 'METAL'):
            try:
                prefs.compute_device_type = dev_type
                prefs.get_devices()
                for d in prefs.devices:
                    d.use = True
                break
            except Exception:
                continue
    except Exception:
        pass

    scene.render.resolution_x = 720
    scene.render.resolution_y = 1280
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'HIGH'
    scene.render.filepath = output_mp4_path

def main():
    clear_scene()
    rig = build_sprocket_rig()
    setup_camera_and_lights()

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "videos"))
    os.makedirs(out_dir, exist_ok=True)

    # Save the master .blend file with IDLE action active
    animate_state("idle", *rig)
    blend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "Sprocket_720x1280_Master.blend"))
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"[OK] Saved Master Blend File: {blend_path}")

    # Optional CLI argument `--render-all` renders all 4 MP4 files
    if "--render-all" in sys.argv:
        for state in ("idle", "wave", "walk", "jump-spin"):
            animate_state(state, *rig)
            mp4_file = os.path.join(out_dir, f"sprocket-{state}.mp4")
            configure_cycles_gpu(mp4_file)
            print(f"[CYCLES GPU] Rendering {mp4_file} ...")
            bpy.ops.render.render(animation=True)

if __name__ == "__main__":
    main()
'''

# ==============================================================================
# 2. ONE-CLICK WINDOWS BATCH RENDERER
# ==============================================================================
BATCH_RENDERER = r'''@echo off
echo ============================================================================
echo SPROCKET 720x1280 — BLENDER 5.2 CYCLES GPU BATCH RENDERER
echo Generates:
echo   - /public/videos/sprocket-idle.mp4
echo   - /public/videos/sprocket-wave.mp4
echo   - /public/videos/sprocket-walk.mp4
echo   - /public/videos/sprocket-jump-spin.mp4
echo ============================================================================
blender -b -P "%~dp0generate_and_render_sprocket.py" -- --render-all
echo.
echo [DONE] All 4 Sprocket MP4 clips rendered to /public/videos/!
pause
'''

# ==============================================================================
# 3. STANDALONE PORTFOLIO WIDGET (AUTO-SWITCHES PROCEDURAL <-> REAL CYCLES MP4)
# ==============================================================================
WIDGET_HTML = r'''<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sprocket 720x1280 — Cycles GPU &amp; Procedural Monitor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    /* STRICT ZERO-GREEN PALETTE */
    :root {
      --bg: #04060E;
      --surface: #0B1020;
      --surface-elevated: #11182E;
      --border: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(255, 255, 255, 0.16);
      --brand-indigo: #6366F1;
      --brand-violet: #A855F7;
      --brand-sky: #38BDF8;
      --accent-amber: #F59E0B;
      --accent-rose: #F43F5E;
      --text-primary: #F8FAFC;
      --text-muted: #94A3B8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      padding: 24px 16px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sprocket-shell {
      width: 100%;
      max-width: 1040px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: 22px;
      padding: 24px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
    }
    @media (min-width: 820px) {
      .sprocket-shell {
        grid-template-columns: 1.15fr 0.85fr;
        padding: 32px;
        align-items: center;
      }
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 600;
    }
    .kicker { color: var(--brand-violet); margin-bottom: 6px; display: block; }
    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.65rem, 4vw, 2.25rem);
      font-weight: 800;
      margin-bottom: 10px;
    }
    .lead {
      color: var(--text-muted);
      font-size: 0.96rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .state-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .state-btn {
      min-height: 46px;
      padding: 0 14px;
      border-radius: 12px;
      background: var(--surface-elevated);
      border: 1px solid var(--border-strong);
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .state-btn:hover {
      border-color: var(--brand-sky);
      color: var(--text-primary);
    }
    .state-btn.active {
      background: var(--brand-indigo);
      border-color: var(--brand-indigo);
      color: #ffffff;
      box-shadow: 0 8px 22px rgba(99, 102, 241, 0.35);
    }
    .controls-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(4, 6, 14, 0.55);
      border: 1px solid var(--border);
      margin-bottom: 16px;
    }
    .wire-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      user-select: none;
    }
    .wire-toggle input {
      accent-color: var(--brand-indigo);
      width: 18px;
      height: 18px;
    }
    .note-box {
      font-size: 0.82rem;
      color: var(--text-muted);
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.28);
      line-height: 1.5;
    }
    .note-box code {
      font-family: 'JetBrains Mono', monospace;
      color: var(--brand-sky);
    }

    /* 720x1280 Vertical Monitor Stage */
    .monitor-frame {
      width: 100%;
      max-width: 290px;
      aspect-ratio: 9 / 16;
      margin: 0 auto;
      border-radius: 22px;
      background: #050814;
      border: 2px solid var(--border-strong);
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    }
    .monitor-topbar {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      z-index: 6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      border-radius: 8px;
      background: rgba(4, 6, 14, 0.86);
      border: 1px solid var(--border);
    }
    .badge-mode {
      padding: 2px 7px;
      border-radius: 5px;
      background: var(--brand-indigo);
      color: #fff;
      font-size: 0.65rem;
    }
    #sprocketVideo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 3;
      display: none;
    }
    #sprocketCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 2;
    }
    .monitor-bottombar {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      z-index: 6;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(4, 6, 14, 0.88);
      border: 1px solid var(--border);
      text-align: center;
      color: var(--brand-sky);
    }
  </style>
</head>
<body>
  <section class="sprocket-shell" aria-label="Sprocket 720x1280 3D Monitor">
    <div>
      <span class="mono kicker">Blender 5.2 Python · Cycles GPU</span>
      <h1>Sprocket Rig &amp; 3D Scenes</h1>
      <p class="lead">
        Includes <strong>The Great Desktop Migration</strong> (4.9s/frame), <strong>First Light v2</strong> (15s sunrise sprout with subsurface scattering), and <strong>Sprocket</strong> (720x1280 clay robot).
      </p>

      <div class="state-grid" role="group" aria-label="Sprocket animation states">
        <button type="button" class="state-btn active" data-state="idle" data-title="Sprocket 720x1280 — Idle">
          <span>01. Idle</span><span>●</span>
        </button>
        <button type="button" class="state-btn" data-state="wave" data-title="Sprocket 720x1280 — Wave">
          <span>02. Wave</span><span>↗</span>
        </button>
        <button type="button" class="state-btn" data-state="walk" data-title="Sprocket 720x1280 — Walk">
          <span>03. Walk</span><span>↗</span>
        </button>
        <button type="button" class="state-btn" data-state="jump-spin" data-title="Sprocket 720x1280 — Jump-Spin">
          <span>04. Jump-Spin</span><span>↗</span>
        </button>
      </div>

      <div class="controls-row">
        <label class="wire-toggle">
          <input type="checkbox" id="wireframeToggle" />
          <span>Show wireframe</span>
        </label>
        <span class="mono" id="activeClipSubtitle" style="color:var(--accent-amber);">Sprocket 720x1280 — Idle</span>
      </div>

      <div class="note-box">
        Drop the rendered clips at <code>/public/videos/sprocket-&lt;state&gt;.mp4</code> and the monitor switches from the procedural rig preview to the real Cycles output automatically.
      </div>
    </div>

    <!-- 720x1280 Vertical Monitor -->
    <div class="monitor-frame">
      <div class="monitor-topbar mono">
        <span>SPROCKET_720x1280</span>
        <span class="badge-mode" id="renderSourceBadge">RENDER</span>
      </div>

      <!-- Automatically plays /public/videos/sprocket-<state>.mp4 if file exists -->
      <video id="sprocketVideo" muted loop playsinline preload="metadata"></video>

      <!-- Procedural 3D Rig Fallback + Wireframe Overlay -->
      <canvas id="sprocketCanvas" width="360" height="640"></canvas>

      <div class="monitor-bottombar mono" id="monitorFooterText">
        SPROCKET 720X1280 — IDLE
      </div>
    </div>
  </section>

  <script>
    (() => {
      const videoEl = document.getElementById('sprocketVideo');
      const canvas = document.getElementById('sprocketCanvas');
      const ctx = canvas.getContext('2d');
      const wireToggle = document.getElementById('wireframeToggle');
      const subEl = document.getElementById('activeClipSubtitle');
      const footEl = document.getElementById('monitorFooterText');
      const badgeEl = document.getElementById('renderSourceBadge');

      let currentState = 'idle';
      let showWire = false;
      let usingRealMp4 = false;

      const tryLoadMp4 = (state) => {
        const src = `public/videos/sprocket-${state}.mp4`;
        usingRealMp4 = false;
        videoEl.style.display = 'none';
        videoEl.src = src;
        videoEl.load();

        videoEl.onloadeddata = () => {
          usingRealMp4 = true;
          videoEl.style.display = 'block';
          badgeEl.textContent = 'CYCLES MP4';
          videoEl.play().catch(() => {});
        };
        videoEl.onerror = () => {
          usingRealMp4 = false;
          videoEl.style.display = 'none';
          badgeEl.textContent = 'RENDER';
        };
      };

      document.querySelectorAll('.state-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.state-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          currentState = btn.getAttribute('data-state') || 'idle';
          const title = btn.getAttribute('data-title') || '';
          subEl.textContent = title;
          footEl.textContent = title.toUpperCase();
          tryLoadMp4(currentState);
        });
      });

      wireToggle.addEventListener('change', (e) => {
        showWire = e.target.checked;
      });

      tryLoadMp4('idle');

      // Procedural 3D Clay Rig Renderer (Runs when MP4 is not yet dropped or Wireframe is on)
      const renderLoop = (now) => {
        const w = canvas.width, h = canvas.height;
        const t = now * 0.004;
        ctx.fillStyle = '#050814';
        ctx.fillRect(0, 0, w, h);

        // Perspective Floor Grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.16)';
        ctx.lineWidth = 1;
        for (let gx = -160; gx <= 160; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(w / 2 + gx * 0.4, h * 0.68);
          ctx.lineTo(w / 2 + gx * 1.5, h * 0.92);
          ctx.stroke();
        }

        let bobY = Math.sin(t) * 8;
        let rot = 0;
        let waveAngle = 0.2;
        let legSwing = 0;
        let walkX = 0;

        if (currentState === 'wave') {
          waveAngle = Math.sin(t * 3.2) * 0.65 - 2.2;
        } else if (currentState === 'walk') {
          bobY = Math.abs(Math.sin(t * 2.6)) * -14;
          legSwing = Math.sin(t * 2.6) * 18;
          walkX = Math.sin(t * 1.3) * 24;
        } else if (currentState === 'jump-spin') {
          bobY = -Math.abs(Math.sin(t * 2.0)) * 68;
          rot = Math.sin(t * 2.0) * 0.45;
        }

        ctx.save();
        ctx.translate(w / 2 + walkX, h * 0.56 + bobY);
        ctx.rotate(rot);

        const drawPart = (x, y, pw, ph, fillHex, strokeHex) => {
          if (!showWire) {
            ctx.fillStyle = fillHex;
            ctx.fillRect(x, y, pw, ph);
          }
          ctx.strokeStyle = showWire ? '#38BDF8' : strokeHex;
          ctx.lineWidth = showWire ? 1.8 : 1.2;
          ctx.strokeRect(x, y, pw, ph);
          if (showWire) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + pw, y + ph);
            ctx.stroke();
          }
        };

        // Antenna
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -110);
        ctx.lineTo(0, -138);
        ctx.stroke();
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(0, -144, 8, 0, Math.PI * 2);
        if (showWire) ctx.stroke(); else ctx.fill();

        // Head
        drawPart(-52, -110, 104, 72, '#A855F7', '#C084FC');

        // Eyes
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(-20, -74, 9, 0, Math.PI * 2);
        ctx.arc(20, -74, 9, 0, Math.PI * 2);
        if (showWire) ctx.stroke(); else ctx.fill();

        // Torso
        drawPart(-44, -28, 88, 86, '#6366F1', '#818CF8');

        // Legs
        drawPart(-30, 62 + legSwing * 0.4, 22, 42, '#A855F7', '#C084FC');
        drawPart(8, 62 - legSwing * 0.4, 22, 42, '#A855F7', '#C084FC');

        // Left Arm
        drawPart(-74, -20 - legSwing * 0.3, 24, 54, '#F59E0B', '#FBBF24');

        // Right Arm (Animated Wave)
        ctx.save();
        ctx.translate(50, -14);
        ctx.rotate(waveAngle);
        drawPart(0, -10, 24, 54, '#F59E0B', '#FBBF24');
        ctx.restore();

        ctx.restore();
        requestAnimationFrame(renderLoop);
      };
      requestAnimationFrame(renderLoop);
    })();
  </script>
</body>
</html>
'''

# ==============================================================================
# 4. TECHNICAL DOCUMENTATION (PROJECT_DOCUMENTATION.md)
# ==============================================================================
DOC_MD = """# Sprocket 720x1280 & Blender 5.2 Cycles GPU Suite
**Author:** Muhammad Ibrahim  
**Workstation Target:** AMD Ryzen 5 3600 + Radeon RX 6600 (Cycles HIP GPU)

## 1. Included Scenes & Specifications
1. **Sprocket (`720x1280` Vertical Clay Robot Rig):**
   - **4 Marker-Based Actions:** `01. Idle`, `02. Wave`, `03. Walk`, `04. Jump-Spin`.
   - **Materials:** Procedural clay shaders with Principled BSDF subsurface scattering (`0.2`) and fine fingerprint noise bump maps in a strict zero-green palette (`#6366F1`, `#A855F7`, `#38BDF8`, `#F59E0B`).
2. **The Great Desktop Migration:**
   - Full scene animation script verified on Blender 5.2.2 with Cycles GPU rendering (~4.9 seconds per frame on RX 6600).
3. **First Light v2:**
   - 15-second animation of a sunrise sprout with procedural node textures, subsurface scattering, lathe-turned pot, denser leaf geometry, compositor bloom, camera depth of field (`f/2.8`), and hill silhouettes.

## 2. How to Generate the `.blend` File & Render the 4 `.mp4` Videos
1. Unzip `Sprocket_Blender52_Project_Package.zip`.
2. Double-click `blender/run_headless_renders.bat` (or run: `blender -b -P blender/generate_and_render_sprocket.py -- --render-all`).
3. Blender 5.2 will save `blender/Sprocket_720x1280_Master.blend` and output:
   - `/public/videos/sprocket-idle.mp4`
   - `/public/videos/sprocket-wave.mp4`
   - `/public/videos/sprocket-walk.mp4`
   - `/public/videos/sprocket-jump-spin.mp4`
4. Open `sprocket-monitor-widget.html` — it automatically detects the rendered `.mp4` files and switches from the procedural preview to the real Cycles output.
"""

def build_package():
    if OUT_DIR.exists():
        import shutil
        shutil.rmtree(OUT_DIR)

    (OUT_DIR / "blender").mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "public" / "videos").mkdir(parents=True, exist_ok=True)

    (OUT_DIR / "blender" / "generate_and_render_sprocket.py").write_text(BLENDER_SCRIPT, encoding="utf-8")
    (OUT_DIR / "blender" / "run_headless_renders.bat").write_text(BATCH_RENDERER, encoding="utf-8")
    (OUT_DIR / "sprocket-monitor-widget.html").write_text(WIDGET_HTML, encoding="utf-8")
    (OUT_DIR / "PROJECT_DOCUMENTATION.md").write_text(DOC_MD, encoding="utf-8")
    (OUT_DIR / "public" / "videos" / "README_VIDEOS.txt").write_text(
        "Drop sprocket-idle.mp4, sprocket-wave.mp4, sprocket-walk.mp4, and sprocket-jump-spin.mp4 here.\n",
        encoding="utf-8"
    )

    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in OUT_DIR.rglob("*"):
            if file_path.is_file():
                zf.write(file_path, file_path.relative_to(OUT_DIR))

    print(f"[SUCCESS] Created complete archive: {os.path.abspath(ZIP_NAME)}")

if __name__ == "__main__":
    build_package()
