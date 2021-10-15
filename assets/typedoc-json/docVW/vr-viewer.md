## VR-VIEWER  
  
The Virtual Reality (VR) Viewer allows you to view 3D models in an environment with a first-person
point of view (POV). This allows you to walk around the model, with gravity automatically pulling
you down to the ground surface.

Point objects are not visible in the VR viewer.

**Viewer Modes**

When viewing the 3D model, you can use two modes:
* Desktop mode: You view the 3D model via a screen, e.g. your desktop monitor or a laptop screen.
* Head Mounted Display (HMD): You plug your HMD into your desktop computer or laptop, and then view
  the 3D model via the HDM.

In desktop mode:
* Rotate view: Left click and drag.
* Walk: Arrow keys, or WASD keys.

In HMD mode:
* Rotate view: Just rotate your head.
* Walk: Arrow keys, or WASD keys.

To enter the HMD mode, click the goggles button in the bottom-right hand corner of the VR viewer.

There are many different types of HMDs on the market (e.g. HTC Vive, Oculus Rift, Oculus Quest,
Oculus Go, Google Daydream, Samsung GearVR, Vive Focus, etc).

**Navigation Mesh**

By default, there is no collision detection. This means that when you walk around your model, you
will always be on the ground plane, and you will be able to walk through any geometric objects in
the scene. 

A navigation mesh is a simple way to constrain the area where you can walk. The navigation mesh
consists of one or more polygons that define the area within which you can walk. When you are
walking around and reach the edge of the navigation mesh polygon, you movement will be automatically
blocked.

The navigation mesh defines the surface where teh camera will be place. As a result, in order to
create the expereince of walking, the navigation mesh will need to be raised above the ground plane,
by for exampel 1.5 meters.

The polygons used for the navigation mesh must have an attribute call `vr_nav_mesh`, with a boolean
value. When set to `true`, the polygon will ne treated as a navigation mesh in the VR model.

In the VR Viewer, any polygons that navigation meshes are automatically hidden. 

Below is screen capture of a model being viewed in teh CAD Viewer, with the navigation mesh
selected.

![A navigation mesh in the CAD viewer.](assets/typedoc-json/docVW/imgs/viewer_vr_nav_mesh_in_cadv.png)

Below is an screen capture of the same model as above, but in the VR Viewer. In this case you can
see that the navigation mesh has been hidden. 

![A model with a navigation mesh, in the VR Viewer.](assets/typedoc-json/docVW/imgs/viewer_vr_nav_mesh_in_vrv.png)

**VR Hotspots**

Mobius Modeller allows you to create VR hotspots in the 3D model. VR hotspots are named locations in
the model where you can teleport to. 

There are two types of hotspots that you can create:
* Standard hotspots: A simple type of hotspot to which you can teleport.
* Panorama hotspots: A hotspot that can be associated with 360° panorama images. When you teleport
  to a panorama hotspot, the panorama images are loaded in the viewer. 

Standard hotspots are visualised as floating tetrahedrons in the model. Below is an
image of such a floating tetrahedron.

![A 3D Icon for a standard hotspot](assets/typedoc-json/docVW/imgs/viewer_vr_standard_hotspot.png)

Panorama hotspots are visualised as floating octahedrons in the model. Below is
an image of such a floating octahedron.

![A 3D Icon for a VR Panorama Hotspot](assets/typedoc-json/docVW/imgs/viewer_vr_panorama_hotspot.png)

In the bottom left corner of the VR Viewer, you will see a dropdown menu that allows you to select
from a list of hotspots in the model. Selecting a hotspot will teleport you to the specified
location.

![Dropdown Hotspot Selector](assets/typedoc-json/docVW/imgs/viewer_vr_hotspot_dropdown.png)

For panorama hotspots, walking up to the hotspot will load the panorama images.

For more information about creating hotspots, see the following help topic:
* [Creating hotspots](/gallery?defaultViewer=doc&docSection=Viewers.vr-viewer-hotspots)


**Heads Up Display (HUD)**

The HUD feature works in the same way as in the CAD viewer. Please see the CAD viewer documentation.

**VR Viewer Settings**

The settings for the VR Viewer can be accessed by the 'gear' icon in the top right-hand corner of
the viewer.

The settings dialog box has three tabs:
* Scene: Set the sky background and default camera position for the scene.
* Light & Shadow: Set up the lights and shdows for the scene.
* Environment: Set the properties of the ground plane for the scene.

**A-Frame**

The VR Viewer uses a framework called _A-Frame_. A-Frame is an open-source web framework for 
building VR experiences.

For more information about A-Frame:
* [A-Frame Website](https://aframe.io/)
* [HMD supported by A-Frame](https://aframe.io/docs/1.2.0/introduction/vr-headsets-and-webvr-browsers.html#which-vr-headsets-does-a-frame-support)