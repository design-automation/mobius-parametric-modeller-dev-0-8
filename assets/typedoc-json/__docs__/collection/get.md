## collection.Get  
  
  
**Description:** Get one or more collections from the model, given a name or list of names.
Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.


The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.


If a single collection is found, the collection will be returned as a single item (not a list).
This is a convenience so that there is no need to get the first item out of the returned list.


If no collections are found, then an empty list is returned.

  
  
**Parameters:**  
  * *names:* A name or list of names. May include wildcards, '?' and '*'.  
  
**Returns:** The collection, or a list of collections.  
