## material.Lambert  
  
  
**Description:** Creates a Lambert material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  
**Returns:** void  
