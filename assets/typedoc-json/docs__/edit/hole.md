## edit.Hole  
  
  
**Description:** Makes one or more holes in a polygon.


The holes are specified by lists of positions.
The positions must be on the polygon, i.e. they must be co-planar with the polygon and
they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
can result in no hole being generated.)


Multiple holes can be created.
- If the positions is a single list, then a single hole will be generated.
- If the positions is a list of lists, then multiple holes will be generated.

  
  
**Parameters:**  
  * *pgon:* A polygon to make holes in.  
  * *entities:* List of positions, or nested lists of positions, or entities from which positions
can be extracted.  
  
**Returns:** Entities, a list of wires resulting from the hole(s).  
