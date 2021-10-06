## edit.Delete  
  
  
**Description:** Deletes geometric entities: positions, points, polylines, polygons, and collections.


- When deleting positions, any topology that requires those positions will also be deleted.
(For example, any vertices linked to the deleted position will also be deleted,
which may in turn result in some edges being deleted, and so forth.)
- When deleting objects (points, polylines, and polygons), topology is also deleted.
- When deleting collections, the objects and other collections in the collection are also deleted.


Topological entities inside objects  (wires, edges, vertices) cannot be deleted.
If a topological entity needs to be deleted, then the current approach is create a new object
with the desired topology, and then to delete the original object.

  
  
**Parameters:**  
  * *entities:* Positions, points, polylines, polygons, collections.  
  * *method:* Enum, delete or keep unused positions.  
  
**Returns:** void  
**Examples:**  
  * `edit.Delete(polygon1, 'delete_selected')`  
    Deletes `polygon1` from the model. The topology for
`polygon1` will be deleted. In addition, any positions being used by `polygon1` will be deleted
only if they are not being used by other objects.  
  * `edit.Delete(polygon1, 'keep_selected')`  
    Deletes everything except `polygon1` from the model. The topology and positions for
`polygon1` will not be deleted.
  
