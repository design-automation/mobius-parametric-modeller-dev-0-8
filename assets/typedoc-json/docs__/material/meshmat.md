## material.MeshMat  
  
  
**Description:** Creates a basic mesh material and saves it in the model attributes.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
If 'apply' id selected, then the actual color will be a combination of the material color
and the vertex colors, as specified by the a vertex attribute called 'rgb'.
In such a case, if material color is set to white, then it will
have no effect, and the color will be defined by the vertex [r,g,b] values.


Additional material properties can be set by calling the functions for the more advanced materials.
These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
Each of these more advanced materials allows you to specify certain additional settings.


In order to assign a material to polygons in the model, a polygon attribute called 'material'.
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *opacity:* The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).  
  * *select\_side:* Enum, select front, back, or both.  
  * *select\_vert\_colors:* Enum, select whether to use vertex colors if they exist.  
  
**Returns:** void  
