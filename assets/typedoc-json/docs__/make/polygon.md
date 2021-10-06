## make.Polygon  
  
  
**Description:** Adds one or more new polygons to the model.  
  
**Parameters:**  
  * *entities:* List or nested lists of positions, or entities from which positions can be extracted.  
  
**Returns:** Entities, new polygon, or a list of new polygons.  
**Examples:**  
  * polygon1 = make.Polygon([pos1,pos2,pos3])  
    Creates a polygon with vertices pos1, pos2, pos3 in sequence.  
  * polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])  
    Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
  
