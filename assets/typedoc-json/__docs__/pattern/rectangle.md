## pattern.Rectangle  
  
  
**Description:** Creates four positions in a rectangle pattern.


The `origin` parameter specifies the centre of the rectangle for which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated for a rectangle on the origin XY plane. So if the origin plane is
rotated, then the rectangle will also be rotated.


The `size` parameter specifies the size of the rectangle. If only one number is given,
then width and length are assumed to be equal. If a list of two numbers is given,
then they will be interpreted as `[width, length]`.The width dimension will be in the
X-direction of the origin plane, and the length will be in the Y direction of the origin plane.


Returns a list of new positions.

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *size:* Size of rectangle. If number, assume square of that length;
if list of two numbers, x and y lengths respectively.  
  
**Returns:** Entities, a list of four positions.  
**Examples:**  
  * posis = pattern.Rectangle([0,0,0], 10)  
    Creates a list of 4 coords, being the vertices of a 10 by 10 square.  
  * `posis = pattern.Rectangle(XY, [10,20])`  
    Creates a list of 4 positions in a rectangle pattern. The rectangle has a width of
10 (in the X direction) and a length of 20 (in the Y direction).
  
