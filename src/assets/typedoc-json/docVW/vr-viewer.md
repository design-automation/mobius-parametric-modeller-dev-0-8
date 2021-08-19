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

Hotspots are defined by creating point objects in your model with an attribute called `vr_hotspot`.
The position of the point object defines the location of the VR hotspot. The `vr_hotspot` `attribute
is a dictionary containing various settings. 

For standard hotspots, only one setting is required: the rotation of teh camera. Here is an
example of a line of code setting the `vr` attribute:

```
my_point@vr = {
    "camera_rotation": 45
}
```

The angle defines the direction you will be looking at when you teleport to that hotspot. 

The panorama hotspot includes two panorama images: one for the foreground and another for the
background. These images form two hemispherical domes, centered on the camera location. The 3D model
is placed in-between these two hemispherical domes. Below is a diagram of the setup:

![Two panorama images](assets/typedoc-json/docVW/imgs/viewer_vr_hemi_domes.png)

For panorama hotspots, additional settings are required for the panorama images. Here is an example
of a line of code setting the `vr` attribute:

```
my_point@vr = {
    "background_url": "http://...",
    "background_rotation": 53,
    "foreground_url": "http://...",
    "foreground_rotation": 53,
    "camera_rotation": 0
}
```

The settings in the dictionary are as follows:
* `background_url`: The url of the background 360° panorama image.
* `background_rotation`: The rotation of the background 360° panorama image.
* `foreground_url`: The url of the foreground 360° panorama image.
* `foreground_rotation`: The rotation of the foreground 360° panorama image.
* `camera_rotation`: The rotation of the camera.

All angles are defined in degrees, relative to the Y axis. Positive angles rotate in a clockwise
direction when looking down at the XY plane; negative angles rotate in an anti-clockwise direction.

**Navigation Mesh**

By default, there is no collision detection. This means that when you walk around your model, you
will always be on the ground plane, and you will be able to walk through any geometric objects in
the scene. 

[to be completed]

**Heads Up Display (HUD)**

The HUD feature works in the same way as in the CAD viewer. Please see the CAD viewer documentation.

**VR Viewer Settings**

The settings for the VR Viewer can be accessed by the 'gear' icon in the top right-hand corner of
the viewer.

The settings dialog box has five tabs:
* Scene: 

[to be completed]

**A-Frame**

The VR Viewer uses a framework called _A-Frame_. A-Frame is an open-source web framework for 
building VR experiences.

For more information about A-Frame:
* [A-Frame Website](https://aframe.io/)
* [HMD supported by A-Frame](https://aframe.io/docs/1.2.0/introduction/vr-headsets-and-webvr-browsers.html#which-vr-headsets-does-a-frame-support)