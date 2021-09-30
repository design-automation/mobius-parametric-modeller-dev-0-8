## modify.Scale  
  
  
**Description:** Scales entities relative to a plane.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to scale.  
  * *plane:* A plane to scale around. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted, 

and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *scale:* Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.  
  
**Returns:** void  
**Examples:**  
  * modify.Scale(entities, plane1, 0.5)  
    Scales entities by 0.5 on plane1.  
  * modify.Scale(entities, plane1, [0.5, 1, 1])  
    Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
  
