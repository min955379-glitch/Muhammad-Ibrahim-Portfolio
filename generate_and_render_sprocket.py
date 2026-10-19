import bpy
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
