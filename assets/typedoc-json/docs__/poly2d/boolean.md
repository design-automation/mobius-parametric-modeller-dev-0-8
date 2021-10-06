## poly2d.Boolean  
  
  
**Description:** Perform a boolean operation on polylines or polygons.


The entities in A can be either polyline or polygons.
The entities in B must be polygons.
The polygons in B are first unioned before the operation is performed.
The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.


If A is an empty list, then an empty list is returned.
If B is an empty list, then the A list is returned.

  
  
**Parameters:**  
  * *a\_entities:* A list of polyline or polygons, or entities from which polyline or polygons can be extracted.  
  * *b\_entities:* A list of polygons, or entities from which polygons can be extracted.  
  * *method:* Enum, the boolean operator to apply.  
  
**Returns:** A list of new polylines and polygons.  
