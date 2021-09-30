## isect.Split  
  
  
**Description:** Splits a polyline or polygon with a polyline.  
  
**Parameters:**  
  * *geometry:* A list of polylines or polygons to be split.  
  * *polyline:* Splitter.  
  
**Returns:** List of two lists containing polylines or polygons.  
**Examples:**  
  * splitresult = isect.Split (pl1, pl2)  
    Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
  
