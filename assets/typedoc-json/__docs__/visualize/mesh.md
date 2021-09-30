## visualize.Mesh  
  
  
**Description:** Controls how polygon meshes are visualized by creating normals on vertices.


The method can either be 'faceted' or 'smooth'.
'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.

  
  
**Parameters:**  
  * *entities:* Vertices belonging to polygons, or entities from which polygon vertices can be extracted.  
  * *method:* Enum, the types of normals to create, faceted or smooth.  
  
**Returns:** void  
