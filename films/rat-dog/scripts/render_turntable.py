from __future__ import annotations
import math
import sys
from pathlib import Path
import vtk

model_path = Path(sys.argv[1]).resolve()
out_path = Path(sys.argv[2]).resolve()
angle_deg = float(sys.argv[3]) if len(sys.argv) > 3 else 25.0

rw = vtk.vtkRenderWindow()
rw.SetOffScreenRendering(1)
rw.SetSize(960, 960)
renderer = vtk.vtkRenderer()
rw.AddRenderer(renderer)
renderer.SetBackground(0.025, 0.03, 0.05)
renderer.SetBackground2(0.10, 0.12, 0.18)
renderer.GradientBackgroundOn()

importer = vtk.vtkGLTFImporter()
importer.SetFileName(str(model_path))
importer.SetRenderWindow(rw)
importer.Update()

# Importer owns/creates renderer on the window. Use its first renderer if available.
renderers = rw.GetRenderers()
renderers.InitTraversal()
r = renderers.GetNextItem()
if r is None:
    r = renderer
else:
    renderer = r
renderer.SetBackground(0.025, 0.03, 0.05)
renderer.SetBackground2(0.10, 0.12, 0.18)
renderer.GradientBackgroundOn()

renderer.AutomaticLightCreationOff()
for pos, color, intensity in [
    ((4.0, 6.0, 7.0), (1.0, 0.88, 0.78), 1.1),
    ((-5.0, 3.5, 3.0), (0.45, 0.68, 1.0), 0.75),
    ((3.0, 4.0, -5.0), (1.0, 0.35, 0.55), 0.58),
]:
    light = vtk.vtkLight()
    light.SetLightTypeToSceneLight()
    light.SetPosition(*pos)
    light.SetFocalPoint(0, 0.5, 0)
    light.SetColor(*color)
    light.SetIntensity(intensity)
    renderer.AddLight(light)

# Floor disk
cyl = vtk.vtkCylinderSource()
cyl.SetRadius(2.1)
cyl.SetHeight(0.08)
cyl.SetResolution(96)
cyl.Update()
mapper = vtk.vtkPolyDataMapper()
mapper.SetInputConnection(cyl.GetOutputPort())
floor = vtk.vtkActor()
floor.SetMapper(mapper)
floor.SetPosition(0, -1.20, 0)
floor.GetProperty().SetColor(0.08, 0.09, 0.12)
floor.GetProperty().SetSpecular(0.35)
floor.GetProperty().SetSpecularPower(45)
renderer.AddActor(floor)

cam = renderer.GetActiveCamera()
ang = math.radians(angle_deg)
radius = 6.7
cam.SetPosition(math.sin(ang)*radius, 1.25, math.cos(ang)*radius)
cam.SetFocalPoint(0, 0.52, 0)
cam.SetViewUp(0,1,0)
cam.SetViewAngle(28)
renderer.ResetCameraClippingRange()

rw.Render()
window_to_image = vtk.vtkWindowToImageFilter()
window_to_image.SetInput(rw)
window_to_image.SetScale(1)
window_to_image.SetInputBufferTypeToRGBA()
window_to_image.ReadFrontBufferOff()
window_to_image.Update()
writer = vtk.vtkPNGWriter()
writer.SetFileName(str(out_path))
writer.SetInputConnection(window_to_image.GetOutputPort())
writer.Write()
print(out_path)
