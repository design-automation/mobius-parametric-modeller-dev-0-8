## pattern.Bezier  
  
  
**Description:** Creates positions in an Bezier curve pattern, defined by a list of coordinates.


The Bezier is created as either a qadratic or cubic Bezier. It is always an open curve.


The positions are created along the curve at equal parameter values.
This means that the euclidean distance between the positions will not necessarily be equal.


For the quadratic Bezier, three coordinates are required.
For the cubic Bezier, four coordinates are required.


The `coords` parameter gives the list of coordinates
(three coords for quadratics, four coords for cubics).
The first and last coordinates in the list are the start and end positions of the curve.
The middle coordinates act as the control points for controlling the shape of the curve.


The `num_positions` parameter specifies the total number of positions to be generated.


For more information, see the wikipedia article:
<a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve">B%C3%A9zier_curve</a>.

  
  
**Parameters:**  
  * *coords:* undefined  
  * *num\_positions:* Number of positions to be distributed along the Bezier.  
  
**Returns:** Entities, a list of positions.  
**Examples:**  
  * `posis = pattern.Bezier([[0,0,0], [10,0,50], [20,0,0]], 20)`  
    Creates a list of 20 positions distributed along a Bezier curve.
  
