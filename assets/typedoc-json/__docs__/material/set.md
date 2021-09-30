## material.Set  
  
  
**Description:** Assign a material to one or more polylines or polygons.


A material name is assigned to the polygons. The named material must be separately defined as a
material in the model attributes. See the `material.LineMat()` or `material.MeshMat()` functions.


The material name is a sting.


For polylines, the `material` argument must be a single name.


For polygons, the `material` argument can accept either be a single name, or a
list of two names. If it is a single name, then the same material is assigned to both the
front and back of teh polygon. If it is a list of two names, then the first material is assigned
to the front, and the second material is assigned to the back.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the material.  
  * *material:* The name of the material.  
  
**Returns:** void  
