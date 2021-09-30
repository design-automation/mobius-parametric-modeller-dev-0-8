## util.VrPanorama  
  
  
**Description:** Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
the hotspot, the panorama images will be loaded into the view. 
  
  
**Parameters:**  
  * *point:* The point object to be used for creating a panorama. If this point is already
defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.  
  * *back\_url:* The URL of the 360 degree panorama image to be used for the background.  
  * *back\_rot:* undefined  
  * *fore\_url:* The URL of the 360 degree panorama image to be used for the foreground. If `null`
then no foreground image will be used.  
  * *fore\_rot:* The rotation of the forground panorama image, in degrees, in the
counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.  
  
**Returns:** void  
