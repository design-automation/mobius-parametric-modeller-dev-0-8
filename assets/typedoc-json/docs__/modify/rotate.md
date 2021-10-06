## modify.Rotate  
  
  
**Description:** Rotates entities on plane by angle.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to rotate.  
  * *ray:* A ray to rotate around. 

Given a plane, a ray will be created from the plane z axis. 

Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. 

Given any entities, the centroid will be extracted, 

and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.  
  * *angle:* Angle (in radians).  
  
**Returns:** void  
**Examples:**  
  * modify.Rotate(polyline1, plane1, PI)  
    Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
  
