## make.Loft  
  
  
**Description:** Lofts between entities.  
  
**Parameters:**  
  * *entities:* List of entities, or list of lists of entities.  
  * *divisions:* undefined  
  * *method:* Enum, if 'closed', then close the loft back to the first entity in the list.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the loft.  
**Examples:**  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3.  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.  
  * quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')  
    Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
  
