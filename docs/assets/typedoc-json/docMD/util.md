# UTIL  
  
## Select  
  
  
**Description:** Select entities in the model.  
  
**Parameters:**  
  * *entities:* undefined  
  
**Returns:** void  
  
  
## VrHotspot  
  
  
**Description:** Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.

  
  
**Parameters:**  
  * *point:* A point object to be used for creating hotspots.  
  * *name:* A name for the VR hotspots. If `null`, a default name will be created.  
  * *camera_rot:* The rotation of the camera direction when you teleport yo the hotspot. The
rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
If `null`, the camera rotation will default to 0.  
  
**Returns:** void  
  
  
## VrPanorama  
  
  
**Description:** Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
the hotspot, the panorama images will be loaded into the view. 
  
  
**Parameters:**  
  * *point:* The point object to be used for creating a panorama. If this point is already
defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.  
  * *back_url:* The URL of the 360 degree panorama image to be used for the background.  
  * *back_rot:* undefined  
  * *fore_url:* The URL of the 360 degree panorama image to be used for the foreground. If `null`
then no foreground image will be used.  
  * *fore_rot:* The rotation of the forground panorama image, in degrees, in the
counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.  
  
**Returns:** void  
  
  
## ParamInfo  
  
  
**Description:** Returns am html string representation of the parameters in this model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model.  
  
  
## EntityInfo  
  
  
**Description:** Returns an html string representation of one or more entities in the model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  * *entities:* One or more objects ot collections.  
  
**Returns:** void  
  
  
## ModelInfo  
  
  
**Description:** Returns an html string representation of the contents of this model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCheck  
  
  
**Description:** Checks the internal consistency of the model. Used for debugigng Mobius.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCompare  
  
  
**Description:** Compares two models. Used for grading models.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to compare this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## ModelMerge  
  
  
**Description:** Merges data from another model into this model.
This is the same as importing the model, except that no collection is created.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to import into this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## SendData  
  
  
**Description:** Post a message to the parent window.  
  
**Parameters:**  
  * *data:* The data to send, a list or a dictionary.  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
