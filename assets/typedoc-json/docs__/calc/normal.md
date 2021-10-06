## calc.Normal  
  
  
**Description:** Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
by the specified scale factor.  
  
**Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *scale:* The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)  
  
**Returns:** The normal vector [x, y, z] or a list of normal vectors.  
**Examples:**  
  * normal1 = calc.Normal (polygon1, 1)  
    If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
  
