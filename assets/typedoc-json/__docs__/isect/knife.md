## isect.Knife  
  
  
**Description:** Separates a list of points, polylines or polygons into two lists with a plane.  
  
**Parameters:**  
  * *geometry:* List of points, polylines or polygons.  
  * *plane:* Knife.  
  * *keep:* Keep above, keep below, or keep both lists of separated points, polylines or polygons.  
  
**Returns:** List, or list of two lists, of points, polylines or polygons.  
**Examples:**  
  * knife1 = isect.Knife ([p1,p2,p3,p4,p5], plane1, keepabove)  
    Returns [[p1,p2,p3],[p4,p5]] if p1, p2, p3 are points above the plane and p4, p5 are points below the plane.
  
