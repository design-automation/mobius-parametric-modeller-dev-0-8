## make.Polyline  
  
  
**Description:** Adds one or more new polylines to the model.  
  
**Parameters:**  
  * *entities:* List or nested lists of positions, or entities from which positions can be extracted.  
  * *close:* Enum, 'open' or 'close'.  
  
**Returns:** Entities, new polyline, or a list of new polylines.  
**Examples:**  
  * polyline1 = make.Polyline([position1,position2,position3], close)  
    Creates a closed polyline with vertices position1, position2, position3 in sequence.
  
