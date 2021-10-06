## modify.Move  
  
  
**Description:** Moves entities. The directio and distance if movement is specified as a vector.


If only one vector is given, then all entities are moved by the same vector.
If a list of vectors is given, the each entity will be moved by a different vector.
In this case, the number of vectors should be equal to the number of entities.


If a position is shared between entites that are being moved by different vectors,
then the position will be moved by the average of the vectors.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to move.  
  * *vectors:* undefined  
  
**Returns:** void  
**Examples:**  
  * modify.Move(pline1, [1,2,3])  
    Moves pline1 by [1,2,3].  
  * modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )  
    Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].  
  * modify.Move([pgon1, pgon2], [1,2,3] )  
    Moves both pgon1 and pgon2 by [1,2,3].
  
