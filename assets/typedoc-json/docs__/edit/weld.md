## edit.Weld  
  
  
**Description:** Make or break welds between vertices.
If two vertices are welded, then they share the same position.


- When making a weld between vertices, a new position is created. The new position is calculate
as the average of all the existing positions of the vertices. The vertices will then be linked
to the new position. This means that if the position is later moved, then all vertices will be
affected. The new position is returned. The positions that become shared are returned.
- When breaking a weld between vetices, existing positions are duplicated. Each vertex is then
linked to one of these duplicate positions. If these positions are later moved, then only one
vertex will be affected.  The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of vertices, or entities from which vertices can be extracted.  
  * *method:* Enum; the method to use, either `make_weld` or `break_weld`.  
  
**Returns:** void  
