## query.Sort  
  
  
**Description:** Sorts entities based on an attribute.


If the attribute is a list, and index can also be specified as follows: #@name1[index].

  
  
**Parameters:**  
  * *entities:* List of two or more entities to be sorted, all of the same entity type.  
  * *attrib:* Attribute name to use for sorting. Can be `name`, `[name, index]`, or `[name, key]`.  
  * *method\_enum:* Enum, sort descending or ascending.  
  
**Returns:** Entities, a list of sorted entities.  
**Examples:**  
  * sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)  
    Returns a list of three positions, sorted according to the descending z value.
  
