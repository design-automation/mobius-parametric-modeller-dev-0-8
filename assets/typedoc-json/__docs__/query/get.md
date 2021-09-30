## query.Get  
  
  
**Description:** Get entities from a list of entities.
For example, you can get the position entities from a list of polygon entities.


The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.


The resulting list of entities will not contain duplicate entities.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, the type of entity to get.  
  * *entities:* Optional, list of entities to get entities from, or null to get all entities in the model.  
  
**Returns:** Entities, a list of entities.  
**Examples:**  
  * positions = query.Get('positions', [polyline1, polyline2])  
    Returns a list of positions that are part of polyline1 and polyline2.
  
