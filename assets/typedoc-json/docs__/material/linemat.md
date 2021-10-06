## material.LineMat  
  
  
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
