## intersect.PlaneEdge  
  
  
**Description:** Calculates the xyz intersection between a plane and a list of edges.


This ignores the intersections between planes and polygon face triangles.

  
  
**Parameters:**  
  * *plane:* A plane.  
  * *entities:* An edge or list of edges, or entities from which edges can be extracted.  
  
**Returns:** A list of xyz intersection coordinates.  
**Examples:**  
  * coords = intersect.PlaneEdge(plane, polyline1)  
    Returns a list of coordinates where the plane intersects with the edges of polyline1.
  
