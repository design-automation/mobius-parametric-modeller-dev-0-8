## poly2d.Clean  
  
  
**Description:** Clean a polyline or polygon.


Vertices that are closer together than the specified tolerance will be merged.
Vertices that are colinear within the tolerance distance will be deleted.

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for deleting vertices from the polyline.  
  
**Returns:** A list of new polygons.  
