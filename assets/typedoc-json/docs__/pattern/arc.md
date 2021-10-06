## pattern.Arc  
  
  
**Description:** Creates positions in an arc or circle pattern.


The `origin` parameter specifies the centre of the polyhedron for which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated for an arc aligned with the origin XY plane.
So if the origin plane is rotated, then the rotated will also be rotated.


The `radius` parameter specifies the size of the arc.


The `num_positions` parameter specifies the total number of positions to be generated on the arc.


The `arc_angle` specifies the angle of the arc, in radians. Angles start at thet X-axis of the
origin plane and move in a counter-clockwise direction. Two angles are needed to define an arc,
a `start_angle` and `end_angle`. The angles may be positive or negative, and may be
greater than `2*PI` or smaller than `-2*PI`.


Positions will always be generated in sequence, from the start angle towards the end angle.
- If the start angle is smaller than the end angle, then the positions will be generated in
counter-clockwise order.
- If the start angle is greater than the end angle, then the positions will be generated in
clockwise order.


The angle may either be given as a single number, as a list of two numbers, or as `null`:
- If the angle is given as a single number, then the arc angles will be ser to be
`[0, end_angle]`. This means that the start of the arc will coincide with the X-axis
of the origin plane.
- If the angle is given as a list of two numbers, then they will be set to be
`[start_angle, end_angle]`.
- If the angle is set to `null`, then the arc angles will be set to be
`[0, 2*PI]` In addition, duplicate positions at start and end of the arc are
automatically removed.


Note that setting the arc angle to null is not the same as setting it to `2*PI`
When setting the arc angle to `2*PI`, you will get a duplicate positions at start and end
of the arc.

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>, specifying the centre of the arc.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *radius:* Radius of circle as a number.  
  * *num\_positions:* Number of positions to be distributed equally along the arc.  
  * *arc\_angle:* Angle of arc (in radians). If a list of two numbers is given, then the first
number specifies the arc start angle, and the second number the arc end angle, i.e.
`[arc_start_angle, arc_end_angle]`. If a single numer is specified, then the angles will be set
to `[0, arc_end_angle]`. If `null` is given, then the angles will be set to `[0, 2 * PI]`.  
  
**Returns:** Entities, a list of positions.  
**Examples:**  
  * `posis = pattern.Arc([0,0,0], 10, 12, PI)`  
    Creates a list of 12 positions distributed equally along a semicircle of radius 10
starting at an angle of 0 and ending at an angle of 180 degrees, rotating in a counter-clockwise
direction.
  
