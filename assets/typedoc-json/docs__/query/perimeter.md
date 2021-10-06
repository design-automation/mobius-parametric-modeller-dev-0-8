## query.Perimeter  
  
  
**Description:** Returns a list of perimeter entities. In order to qualify as a perimeter entity,
entities must be part of the set of input entities and must have naked edges.

  
  
**Parameters:**  
  * *ent\_type:* Enum, select the type of perimeter entities to return  
  * *entities:* List of entities.  
  
**Returns:** Entities, a list of perimeter entities.  
**Examples:**  
  * query.Perimeter('edges', [polygon1,polygon2,polygon])  
    Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
  
