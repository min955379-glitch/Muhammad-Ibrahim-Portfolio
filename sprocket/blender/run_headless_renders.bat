@echo off
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
