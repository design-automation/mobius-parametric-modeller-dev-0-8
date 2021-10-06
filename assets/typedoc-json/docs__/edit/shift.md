## edit.Shift  
  
  
**Description:** Shifts the order of the edges in a closed wire.


In a closed wire (either a closed polyline or polygon), the edges form a closed ring. Any edge
(or vertex) could be the first edge of the ring. In some cases, it is useful to have an edge in
a particular position in a ring. This function allows the edges to be shifted either forwards or
backwards around the ring. The order of the edges in the ring will remain unchanged.


- An offset of zero has no effect.
- An offset of 1 will shift the edges so that the second edge becomes the first edge.
- An offset of 2 will shift the edges so that the third edge becomes the first edge.
- An offset of -1 will shift the edges so that the last edge becomes the first edge.

  
  
**Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  * *offset:* The offset, a positive or negative integer.  
  
**Returns:** void  
**Examples:**  
  * `modify.Shift(polygon1, 1)`  
    Shifts the edges in the polygon wire, so that the every edge moves back by one position
in the ring. The first edge will become the last edge.  
  * `edit.Shift(polyline1, -1)`  
    Shifts the edges in the closed polyline wire, so that every edge moves up by one position
in the ring. The last edge will become the first edge.
  
