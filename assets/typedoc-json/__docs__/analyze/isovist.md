## analyze.Isovist  
  
  
**Description:** Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.


The isovist is calculated by shooting rays out from the origins in a radial pattern.
The 'radius' argument defines the maximum radius of the isovist.
(The radius is used to define the maximum distance for shooting the rays.)
The 'num_rays' argument defines the number of rays that will be shot,
in a radial pattern parallel to the XY plane, with equal angle between rays.
More rays will result in more accurate result, but will also be slower to execute.


Returns a dictionary containing different isovist metrics.


1. 'avg_dist': The average distance from origin to the perimeter.
2. 'min_dist': The minimum distance from the origin to the perimeter.
3. 'max_dist': The minimum distance from the origin to the perimeter.
4. 'area': The area of the isovist.
5. 'perimeter': The perimeter of the isovist.
4. 'area_ratio': The ratio of the area of the isovist to the maximum area.
5. 'perimeter_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
6. 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
7. 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
8. 'cluster': The ratio of the radius of an idealized circle with the actual area of the
isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael Batty, 2001).



  
  
**Parameters:**  
  * *origins:* A list of Rays or a list of Planes, to be used as the origins for calculating the isovists.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the isovist.  
  * *num\_rays:* The number of rays to generate when calculating isovists.
  
