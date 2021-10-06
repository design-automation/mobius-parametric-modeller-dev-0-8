# MAKE  
  
The `make` module has functions for making new entities in the model.
All these functions return the IDs of the entities that are created.  
  
  
## Position  
  
  
**Description:** Adds one or more new position to the model.  
  
**Parameters:**  
  * *coords:* A list of three numbers, or a list of lists of three numbers.  
  
**Returns:** A new position, or nested list of new positions.  
**Examples:**  
  * position1 = make.Position([1,2,3])  
    Creates a position with coordinates x=1, y=2, z=3.  
  * positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])  
    Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
  
  
  
## Point  
  
  
**Description:** Adds one or more new points to the model.  
  
**Parameters:**  
  * *entities:* Position, or list of positions, or entities from which positions can be extracted.  
  
**Returns:** Entities, new point or a list of new points.  
**Examples:**  
  * point1 = make.Point(position1)  
    Creates a point at position1.
  
  
  
## Polyline  
  
  
**Description:** Adds one or more new polylines to the model.  
  
**Parameters:**  
  * *entities:* List or nested lists of positions, or entities from which positions can be extracted.  
  * *close:* Enum, 'open' or 'close'.  
  
**Returns:** Entities, new polyline, or a list of new polylines.  
**Examples:**  
  * polyline1 = make.Polyline([position1,position2,position3], close)  
    Creates a closed polyline with vertices position1, position2, position3 in sequence.
  
  
  
## Polygon  
  
  
**Description:** Adds one or more new polygons to the model.  
  
**Parameters:**  
  * *entities:* List or nested lists of positions, or entities from which positions can be extracted.  
  
**Returns:** Entities, new polygon, or a list of new polygons.  
**Examples:**  
  * polygon1 = make.Polygon([pos1,pos2,pos3])  
    Creates a polygon with vertices pos1, pos2, pos3 in sequence.  
  * polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])  
    Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
  
  
  
## Loft  
  
  
**Description:** Lofts between entities.  
  
**Parameters:**  
  * *entities:* List of entities, or list of lists of entities.  
  * *divisions:* undefined  
  * *method:* Enum, if 'closed', then close the loft back to the first entity in the list.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the loft.  
**Examples:**  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3.  
  * quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')  
    Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.  
  * quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')  
    Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
  
  
  
## Extrude  
  
  
**Description:** Extrudes geometry by distance or by vector.
- Extrusion of a position, vertex, or point produces polylines;
- Extrusion of an edge, wire, or polyline produces polygons;
- Extrusion of a face or polygon produces polygons, capped at the top.  
  
**Parameters:**  
  * *entities:* A list of entities, can be any type of entitiy.  
  * *dist:* Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).  
  * *divisions:* Number of divisions to divide extrusion by. Minimum is 1.  
  * *method:* Enum, when extruding edges, select quads, stringers, or ribs  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the extrude.  
**Examples:**  
  * extrusion1 = make.Extrude(point1, 10, 2, 'quads')  
    Creates a polyline of total length 10 (with two edges of length 5 each) in the z-direction.
In this case, the 'quads' setting is ignored.  
  * extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')  
    Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
  
  
  
## Sweep  
  
  
**Description:** Sweeps a cross section wire along a backbone wire.  
  
**Parameters:**  
  * *entities:* Wires, or entities from which wires can be extracted.  
  * *x\_section:* undefined  
  * *divisions:* Segment length or number of segments.  
  * *method:* Enum, select the method for sweeping.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the sweep.  
  
  
## Join  
  
  
**Description:** Joins existing polyline or polygons to create new polyline or polygons.  
  
**Parameters:**  
  * *entities:* Polylines or polygons, or entities from which polylines or polygons can be extracted.  
  
**Returns:** Entities, a list of new polylines or polygons resulting from the join.  
  
  
## Cut  
  
  
**Description:** Cuts polygons and polylines using a plane.  
  
**Parameters:**  
  * *entities:* Polylines or polygons, or entities from which polyline or polygons can be extracted.  
  * *plane:* The plane to cut with.  
  * *method:* Enum, select the method for cutting.  
  
**Returns:** Entities, a list of three lists of entities resulting from the cut.  
  
  
## Copy  
  
  
**Description:** Creates a copy of one or more entities.


Positions, objects, and collections can be copied. Topological entities (vertices, edges, and
wires) cannot be copied since they cannot exist without a parent entity.


When entities are copied, their positions are also copied. The original entities and the copied
entities will not be welded (they will not share positions).


The copy operation includes an option to also move entities, by a specified vector. If the vector
is null, then the entities will not be moved.


The vector argument is overloaded. If you supply a list of vectors, the function will try to find
a 1 -to-1 match between the list of entities and the list of vectors. In the overloaded case, if
the two lists do not have the same length, then an error will be thrown.

  
  
**Parameters:**  
  * *entities:* Entity or lists of entities to be copied. Entities can be positions, points,
polylines, polygons and collections.  
  * *vector:* A vector to move the entities by after copying, can be `null`.  
  
**Returns:** Entities, the copied entity or a list of copied entities.  
**Examples:**  
  * copies = make.Copy([position1, polyine1, polygon1], [0,0,10])  
    Creates a copy of position1, polyine1, and polygon1 and moves all three entities 10
units in the Z direction.
  
  
  
## Clone  
  
  
**Description:** Adds a new copy of specified entities to the model, and deletes the original entity.  
  
**Parameters:**  
  * *entities:* Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.  
  
**Returns:** Entities, the cloned entity or a list of cloned entities.  
**Examples:**  
  * copies = make.Copy([position1,polyine1,polygon1])  
    Creates a copy of position1, polyine1, and polygon1.
  
  
  
