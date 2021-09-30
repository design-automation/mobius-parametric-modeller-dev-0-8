## modify.Mirror  
  
  
**Description:** Mirrors entities across a plane.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to mirros.  
  * *plane:* A plane to scale around. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted, 

and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  
**Returns:** void  
**Examples:**  
  * modify.Mirror(polygon1, plane1)  
    Mirrors polygon1 across plane1.
  
