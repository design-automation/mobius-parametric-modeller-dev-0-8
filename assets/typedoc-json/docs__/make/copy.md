## make.Copy  
  
  
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
  
