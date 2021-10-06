## modify.Remesh  
  
  
**Description:** Remesh a face or polygon.


When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.


Remeshing will regenerate the triangulated mesh for the face.


Remeshing is not performed automatically as it would degrade performance.
Instead, it is left up to the user to remesh only when it is actually required.

  
  
**Parameters:**  
  * *entities:* Single or list of faces, polygons, collections.  
  
**Returns:** void  
**Examples:**  
  * modify.Remesh(polygon1)  
    Remeshs the face of the polygon.
  
