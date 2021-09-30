## poly2d.Stitch  
  
  
**Description:** Adds vertices to polyline and polygons at all locations where egdes intersect one another.
The vertices are welded.
This can be useful for creating networks that can be used for shortest path calculations.


The input polyline and polygons are copied.

  
  
**Parameters:**  
  * *entities:* A list polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for extending open plines if they are almost intersecting.  
  
**Returns:** Copies of the input polyline and polygons, stiched.  
