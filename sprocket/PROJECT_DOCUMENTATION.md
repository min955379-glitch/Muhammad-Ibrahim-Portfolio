# Sprocket 720x1280 & Blender 5.2 Cycles GPU Suite
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
