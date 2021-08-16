## VR-VIEWER  
  
The Virtual Reality (VR) Viewer allows you to view 3D models in an environment with a first-person point of view (POV).
This allows you to walk around the model, with gravity automatically pulling you down to the ground
surface.

When viewing the 3D model, you can use two modes:
* Desktop mode: You view the 3D model via a screen, e.g. your desktop monitor or a laptop screen.
* Head Mounted Display (HMD): You plug your HMD into your desktop computer or laptop, and then 
view the 3D model via the HDM.

To enter the HMD mode, click the googles button in the bottom-right hand corner of the viewer.

In desktop mode:
* Rotate view: Left click and drag.
* Walk: Arrow keys, or WASD.

In HMD mode:
* Rotate view: Just rotate your head.
* Walk: Arrow keys, or WASD.

There are many different type sof HMDs on teh market (e.g. HTC Vive, Oculus Rift, Oculus Quest, 
Oculus Go, Google Daydream, Samsung GearVR, Vive Focus, etc).

Point objects are not visible in the VR viewer.

**A-Frame**

The VR Viewer uses a framework called _A-Frame_. A-Frame is an open-source web framework for 
building VR experiences.

For more information about A-Frame:
* [A-Frame Website](https://aframe.io/)
* [HMD supported by A-Frame](https://aframe.io/docs/1.2.0/introduction/vr-headsets-and-webvr-browsers.html#which-vr-headsets-does-a-frame-support)

**Hotspots**

Mobius Modeller allows you to create VR hotspots in the 3D model. VR hotspots are named locations in 
the model where you can teleport to. 

In the VR Viewer, hotspots are visualised as floating tetrahedrons in the model. 

In the bottom left corner of the VR Viewer, you will see a 
dropdown menu that allows you to select from a list of hotspots in the model. Selecting a hotspot
will teleport you to the specified location.



Hotspots are defined by creating point objects in your model with an attribute called `vr`. 
The value of this attribute is a dictionary containing one setting: a camera rotation. Here is an 
example of a line of code setting the `vr` attribute:

```
my_point@vr = {
    "camera_rotation": 45
}
```

The position of the point object defines the location of teh VR hotspot. The angle defines the 
direction you will be looking at when you teleport to that hotspot.

The angles are defined in degrees, relative to the Y axis. Positive angles rotate in a clockwise 
direction when looking down the Z axis; negative angles rotate in an anti-clockwise direction.




**360° Panoramas**

VR hotspots can be associates with 360° panoramas. Such hotspots are referred to as 
_panorama hotspots_.

When you teleport to or enter a panorama hotspot, the 360° panorama images will be automatically
loaded. 

```
my_point@vr = {
    "background_url": "http://...",
    "background_rotation": 53,
    "foreground_url": "http://...",
    "foreground_rotation": 53,
    "camera_rotation": 0}
```

The settings in the dictionary are as follows:
* `background_url`: 
* `background_rotation`:
* `foreground_url`: 
* `foreground_rotation`: 
* `camera_rotation`: 

[to be completed]


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