# MATERIAL  
  
The `material` module has functions for defining materials.
The material definitions are saved as attributes at the model level.
For more informtion, see the threejs docs: https://threejs.org/  
  
  
## Set  
  
  
**Description:** Assign a material to one or more polylines or polygons.


A material name is assigned to the polygons. The named material must be separately defined as a
material in the model attributes. See the `material.LineMat()` or `material.MeshMat()` functions.


The material name is a sting.


For polylines, the `material` argument must be a single name.


For polygons, the `material` argument can accept either be a single name, or a
list of two names. If it is a single name, then the same material is assigned to both the
front and back of teh polygon. If it is a list of two names, then the first material is assigned
to the front, and the second material is assigned to the back.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the material.  
  * *material:* The name of the material.  
  
**Returns:** void  
  
  
## LineMat  
  
  
**Description:** Creates a line material and saves it in the model attributes.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
[See the threejs docs](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
If 'apply' id selected, then the actual color will be a combination of the material color
and the vertex colors, as specified by the a vertex attribute called 'rgb'.
In such a case, if material color is set to white, then it will
have no effect, and the color will be defined by the vertex [r,g,b] values.


In order to assign a material to polylines in the model, a polyline attribute called 'material'.
will be created. The value for each polyline must either be null, or must be a material name.


For dashed lines, the 'dash_gap_scale' parameter can be set.
- If 'dash_gap_scale' is null will result in a continouse line.
- If 'dash_gap_scale' is a single number: dash = gap = dash_gap_scale, scale = 1.
- If 'dash_gap_scale' is a list of two numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = 1.
- If 'dash_gap_scale' is a list of three numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = dash_gap_scale[2].


Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
line widths cannot be rendered. As a result, lines width will always be set to 1.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *dash\_gap\_scale:* Size of the dash and gap, and a scale factor. (The gap and scale are optional.)  
  * *select\_vert\_colors:* Enum, select whether to use vertex colors if they exist.  
  
**Returns:** void  
  
  
## MeshMat  
  
  
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
  
  
## Glass  
  
  
**Description:** Creates a glass material with an opacity setting. The material will default to a Phong material.


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *opacity:* The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).  
  
**Returns:** void  
  
  
## Lambert  
  
  
**Description:** Creates a Lambert material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  
**Returns:** void  
  
  
## Phong  
  
  
**Description:** Creates a Phong material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *specular:* The specular color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *shininess:* The shininess, between 0 and 100.  
  
**Returns:** void  
  
  
## Standard  
  
  
**Description:** Creates a Standard material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *roughness:* The roughness, between 0 (smooth) and 1 (rough).  
  * *metalness:* The metalness, between 0 (non-metalic) and 1 (metalic).  
  
**Returns:** void  
  
  
## Physical  
  
  
**Description:** Creates a Physical material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *roughness:* The roughness, between 0 (smooth) and 1 (rough).  
  * *metalness:* The metalness, between 0 (non-metalic) and 1 (metalic).  
  * *reflectivity:* The reflectivity, between 0 (non-reflective) and 1 (reflective).  
  
**Returns:** void  
  
  
