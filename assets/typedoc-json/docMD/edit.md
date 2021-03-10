# EDIT  
  
## Divide  
  
  
**Description:** Divides edges into a set of shorter edges.


If the 'by_number' method is selected, then each edge is divided into a fixed number of equal length shorter edges.
If the 'by length' method is selected, then each edge is divided into shorter edges of the specified length.
The length of the last segment will be the remainder.
If the 'by_min_length' method is selected,
then the edge is divided into the maximum number of shorter edges
that have a new length that is equal to or greater than the minimum.

  
  
**Parameters:**  
  * *entities:* Edges, or entities from which edges can be extracted.  
  * *divisor:* Segment length or number of segments.  
  * *method:* Enum, select the method for dividing edges.  
  
**Returns:** Entities, a list of new edges resulting from the divide.  
**Examples:**  
  * segments1 = make.Divide(edge1, 5, by_number)  
    Creates a list of 5 equal segments from edge1.  
  * segments2 = make.Divide(edge1, 5, by_length)  
    If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
  
  
  
## Hole  
  
  
**Description:** Makes one or more holes in a polygon.


The positions must be on the polygon, i.e. they must be co-planar with the polygon and
they must be within the boundary of the polygon.


If the list of positions consists of a single list, then one hole will be generated.
If the list of positions consists of a list of lists, then multiple holes will be generated.

  
  
**Parameters:**  
  * *pgon:* A face or polygon to make holes in.  
  * *entities:* List of positions, or nested lists of positions, or entities from which positions can be extracted.  
  
**Returns:** Entities, a list of wires resulting from the hole(s).  
  
  
## Weld  
  
  
**Description:** Make or break welds between vertices.
If two vertices are welded, then they share the same position.


When making welds, the positions that become shared are returned.
When breaking welds, the new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of vertices, or entities from which vertices can be extracted.  
  * *method:* Enum; the method to use for welding.  
  
**Returns:** void  
  
  
## Fuse  
  
  
**Description:** Fuse positions that lie within a certain tolerance of one another.
New positions will be created.
If the positions that are fuse have vertices attached, then the vertices will become welded.


In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
The deletion of edges may also result in polylines or polygpns being deleted.


The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of positions, or entities from which positions can be extracted.  
  * *tolerance:* The distance tolerance for fusing positions.
 @returns void
  
  
  
## Ring  
  
  
**Description:** Opens or closes a polyline.

  
  
**Parameters:**  
  * *entities:* undefined  
  * *method:* undefined  
  
**Returns:** void  
**Examples:**  
  * edit.Close([polyline1,polyline2,...], method='close')  
    If open, polylines are changed to closed; if already closed, nothing happens.
  
  
  
## Shift  
  
  
**Description:** Shifts the order of the edges in a closed wire.


In a closed wire, any edge (or vertex) could be the first edge of the ring.
In some cases, it is useful to have an edge in a particular position in a ring.
This function allows the edges to be shifted either forwards or backwards around the ring.
The order of the edges in the ring will remain unchanged.  
  
**Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  * *offset:* undefined  
  
**Returns:** void  
**Examples:**  
  * modify.Shift(face1, 1)  
    Shifts the edges in the face wire, so that the every edge moves up by one position
in the ring. The last edge will become the first edge .  
  * edit.Shift(polyline1, -1)  
    Shifts the edges in the closed polyline wire, so that every edge moves back by one position
in the ring. The first edge will become the last edge.
  
  
  
## Reverse  
  
  
**Description:** Reverses direction of entities.  
  
**Parameters:**  
  * *entities:* Wire, face, polyline, polygon.  
  
**Returns:** void  
**Examples:**  
  * modify.Reverse(face1)  
    Flips face1 and reverses its normal.  
  * edit.Reverse(polyline1)  
    Reverses the order of vertices to reverse the direction of the polyline.
  
  
  
## Delete  
  
  
**Description:** Deletes geometric entities: positions, points, polylines, polygons, and collections.


When deleting positions, any topology that requires those positions will also be deleted.
(For example, any vertices linked to the deleted position will also be deleted,
which may in turn result in some edges being deleted, and so forth.)


When deleting objects (point, polyline, and polygons), topology is also deleted.


When deleting collections, the objects and other collections in the collection are also deleted.

  
  
**Parameters:**  
  * *entities:* Positions, points, polylines, polygons, collections.  
  * *method:* Enum, delete or keep unused positions.  
  
**Returns:** void  
**Examples:**  
  * edit.Delete(polygon1, 'delete_selected')  
    Deletes polygon1 from the model.
  
  
  
