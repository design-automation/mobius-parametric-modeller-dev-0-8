## attrib.Push  
  
  
**Description:** Push attributes up or down the hierarchy. The original attribute is not changed.

  
  
**Parameters:**  
  * *entities:* Entities, the entities to push the attribute values for.  
  * *attrib:* The attribute. Can be `name`, `[name, index_or_key]`,
`[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.  
  * *ent\_type\_sel:* Enum, the target entity type where the attribute values should be pushed to.  
  * *method\_sel:* Enum, the method for aggregating attribute values in cases where aggregation is necessary.
  
