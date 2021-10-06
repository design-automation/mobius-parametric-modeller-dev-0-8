## query.Type  
  
  
**Description:** Checks the type of an entity.


- For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one vertex.
- For is\_unused\_posi, it returns the opposite of is\_used\_posi.
- For is\_object, returns true if the entity is a point, a polyline, or a polygon.
- For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
- For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true.
if the entity is a topological entity, and it is part of an object of the specified type.
- For is\_open, returns true if the entity is a wire or polyline and is open. For is\_closed, it returns the opposite of is\_open.
- For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
- For has\_holes, returns true if the entity is a face or polygon, and it has holes.
- For has\_no\_holes, it returns the opposite of has\_holes.  
  
**Parameters:**  
  * *entities:* An entity, or a list of entities.  
  * *type\_query\_enum:* Enum, select the conditions to test agains.  
  
**Returns:** Boolean or list of boolean in input sequence.  
**Examples:**  
  * query.Type([polyline1, polyline2, polygon1], is\_polyline )  
    Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
  
