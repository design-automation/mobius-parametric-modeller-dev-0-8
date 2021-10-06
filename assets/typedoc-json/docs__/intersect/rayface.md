## intersect.RayFace  
  
  
**Description:** Calculates the xyz intersection between a ray and one or more polygons.


The intersection between each polygon face triangle and the ray is caclulated.
This ignores the intersections between rays and edges (including polyline edges).

  
  
**Parameters:**  
  * *ray:* A ray.  
  * *entities:* A polygon or list of polygons.  
  
**Returns:** A list of xyz intersection coordinates.  
**Examples:**  
  * coords = intersect.RayFace(ray, polygon1)  
    Returns a list of coordinates where the ray  intersects with the polygon.
  
