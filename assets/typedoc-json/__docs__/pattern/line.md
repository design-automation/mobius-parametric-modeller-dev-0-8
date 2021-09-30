## pattern.Line  
  
  
**Description:** Creates a set of positions in a straight line pattern.


The `origin` parameter specifies the centre of the straight line along which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated along an straight line aligned with the X axis of the origin
plane.


Returns the list of new positions.

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *length:* The length of the line along which positions will be generated.  
  * *num\_positions:* undefined  
  
**Returns:** Entities, a list of new positions.  
