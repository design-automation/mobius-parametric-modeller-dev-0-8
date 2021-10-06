## edit.Ring  
  
  
**Description:** Opens or closes a polyline.


A polyline can be open or closed. A polyline consists of a sequence of vertices and edges.
Edges connect pairs of vertices.
- An open polyline has no edge connecting the first and last vertices. Closing a polyline
adds this edge.
- A closed polyline has an edge connecting the first and last vertices. Opening a polyline
deletes this edge.

  
  
**Parameters:**  
  * *entities:* Polyline(s).  
  * *method:* Enum; the method to use, either `open` or `close`.  
  
**Returns:** void  
**Examples:**  
  * `edit.Ring([polyline1,polyline2,...], method='close')`  
    If open, polylines are changed to closed; if already closed, nothing happens.
  
