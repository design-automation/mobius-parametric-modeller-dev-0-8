## pattern.Interpolate  
  
  
**Description:** Creates positions in an spline pattern. Returns a list of new positions.
It is a type of interpolating spline (a curve that goes through its control points).


The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
The positions that get generated will be divided equally between the control points.
For example, if you define 4 control points for a closed spline, and set 'num_positions' to be 40,
then you will get 8 positions between each pair of control points,
irrespective of the distance between the control points.


The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.


For more information, see the wikipedia article:
<a href="https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline">Catmull–Rom spline</a>.


<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png"
alt="Curve types" width="100">

  
  
**Parameters:**  
  * *coords:* A list of coordinates.  
  * *type:* Enum, the type of interpolation algorithm.  
  * *tension:* Curve tension, between 0 and 1. This only has an effect when the 'type' is set
to 'catmullrom'.  
  * *close:* Enum, 'open' or 'close'.  
  * *num\_positions:* Number of positions to be distributed distributed along the spline.  
  
**Returns:** Entities, a list of positions.  
**Examples:**  
  * `posis = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]],
'chordal','close', 0.2, 50)`  
    Creates a list of 50 positions distributed along a spline curve pattern.
  
