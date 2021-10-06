## analyze.Sky  
  
  
**Description:** Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
and 1 means that it has maximum exposure.


Each sensor has a location and direction, specified using either rays or planes.
The direction of the sensor specifies what is infront and what is behind the sensor.
For each sensor, only exposure infront of the sensor is calculated.


The exposure is calculated by shooting rays in reverse.
from the sensor origin to a set of points on the sky dome.
If the rays hits an obstruction, then the sky dome is obstructed..
If the ray hits no obstructions, then the sky dome is not obstructed.


The exposure factor at each sensor point is calculated as follows:
1. Shoot rays to all sky dome points.
2. If the ray hits an obstruction, assign a weight of 0 to that ray.
3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
4. Calculate the total solar expouse by adding up the weights for all rays.
5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.


If 'weighted' is selected, then
the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
Rays parallel to the sensor direction are assigned a weight of 1.
Rays at an oblique angle are assigned a weight equal to the cosine of the angle
betweeen the sensor direction and the ray.


If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.


The detail parameter spacifies the number of rays that get generated.
The higher the level of detail, the more accurate but also the slower the analysis will be.


The number of rays are as follows:
0 = 89 rays,
1 = 337 rays,
2 = 1313 rays,
3 = 5185 rays.


Returns a dictionary containing exposure results.


1. 'exposure': A list of numbers, the exposure factors.



  
  
**Parameters:**  
  * *origins:* A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.  
  * *detail:* An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *limits:* The max distance for raytracing.  
  * *method:* Enum; sky method.
  
