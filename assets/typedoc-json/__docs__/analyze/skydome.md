## analyze.SkyDome  
  
  
**Description:** Generates a sun path, oriented according to the geolocation and north direction.
The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
Note that the solar exposure calculations do not require the sub path to be visualized.


The sun path takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:  
  
**Parameters:**  
  * *origin:* undefined  
  * *detail:* The level of detail for the analysis  
  * *radius:* The radius of the sun path  
  * *method:* Enum, the type of sky to generate.
  
