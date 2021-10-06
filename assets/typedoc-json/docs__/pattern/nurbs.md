## pattern.Nurbs  
  
  
**Description:** Creates positions in an NURBS curve pattern, defined a list of coordinates.


The positions are created along the curve according to the parametric equation of the curve.
This means that the euclidean distance between the positions will not necessarily be equal.
For open BSpline curves, the positions at the start and end tend to be closer together.


The `coords` parameter gives the list of coordinates for generating the curve.
- If the curve is open, then the first and last coordinates in the list are the start and end
positions of the curve. The middle coordinates act as the control points for controlling the
shape of the curve.
- If the curve is closed, then all coordinates act as the control points for controlling the
shape of the curve.


The degree (between 2 and 5) of the curve defines how smooth the curve is.
Quadratic: degree = 2
Cubic: degree = 3
Quartic: degree = 4.


The number of coordinates should be at least one greater than the degree of the curve.


The `num_positions` parameter specifies the total number of positions to be generated.

  
  
**Parameters:**  
  * *coords:* A list of coordinates (must be at least three).  
  * *degree:* The degree of the curve, and integer between 2 and 5.  
  * *close:* Enum, 'close' or 'open'  
  * *num\_positions:* Number of positions to be distributed along the Bezier.  
  
**Returns:** Entities, a list of positions.  
**Examples:**  
  * `posis = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,50], [30,0,0]], 3, 'open', 20)`  
    Creates a list of 20 positions distributed along a Nurbs curve.
  
