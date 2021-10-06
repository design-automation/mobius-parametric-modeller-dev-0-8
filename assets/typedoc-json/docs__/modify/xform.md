## modify.XForm  
  
  
**Description:** Transforms entities from a source plane to a target plane.

  
  
**Parameters:**  
  * *entities:* Vertex, edge, wire, face, position, point, polyline, polygon, collection.  
  * *from\_plane:* Plane defining source plane for the transformation. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted, 

and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *to\_plane:* Plane defining target plane for the transformation. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted, 

and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  
**Returns:** void  
**Examples:**  
  * modify.XForm(polygon1, plane1, plane2)  
    Transforms polygon1 from plane1 to plane2.
  
