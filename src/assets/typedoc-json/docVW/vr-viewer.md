## VR-VIEWER  
  
The VR Viewer allows you to view 3D models in an environment with a first-person point of view (POV).
This allows you to walk around the model, with gravity automatically pulling you down to the ground
surface. 

When viewing the model, you can use two modes:
* Desktop mode. 
* Head Mounted Display (HMD) (using an HMD such as Vive, Quest, Rift, etc).

To enter the HMD mode, click the googles button in the bottom-right hand corner of the viewer.

In desktop mode:
* Rotate view: Left click and drag.
* Walk: Arrow keys, or WASD.

In HMD mode:
* Rotate view: Just rotate your head.
* Walk: Arrow keys, or WASD.

Point objects are not visible in the VR viewer.

**Hotspots**

Hotspots are named locations in the model. 

The point object must have an attribute called `vr`. The value of this attribute is a dictionary
containing a number of settings. Here is an example of a line of code setting the `vr` attribute:

```
my_point@vr = {
    "camera_rotation": 0}
```

The settings in the dictionary are as follows:
* `camera_rotation`: 

The angles are defined in degrees, relative to the Y axis. Positive angles rotate in a clockwise 
direction when looking down the Z axis; negative angles rotate in an ant-clockwise direction. 

**360° Panoramas**

Hotspots can be associates with 360° panoramas. Such hotspots are referred to as panorama hotspots. 

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