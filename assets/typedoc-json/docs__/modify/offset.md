## modify.Offset  
  
  
**Description:** Offsets wires.

  
  
**Parameters:**  
  * *entities:* Edges, wires, faces, polylines, polygons, collections.  
  * *dist:* The distance to offset by, can be either positive or negative  
  
**Returns:** void  
**Examples:**  
  * modify.Offset(polygon1, 10)  
    Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
  
