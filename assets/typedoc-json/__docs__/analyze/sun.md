## analyze.Sun  
  
  
**Description:** Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied locations.
The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
and 1 means that it has maximum exposure.


The calculation takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:  
  
**Parameters:**  
  * *origins:* A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.  
  * *detail:* An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *limits:* The max distance for raytracing.  
  * *method:* Enum; solar method.
  
