# UTIL  
  
## Select  
  
  
**Description:** Select entities in the model.  
  
**Parameters:**  
  * *entities:* undefined  
  
**Returns:** void  
  
  
## ParamInfo  
  
  
**Description:** Returns am html string representation of the parameters in this model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model.  
  
  
## EntityInfo  
  
  
**Description:** Returns an html string representation of one or more entities in the model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  * *entities:* One or more objects ot collections.  
  
**Returns:** void  
  
  
## ModelInfo  
  
  
**Description:** Returns an html string representation of the contents of this model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCheck  
  
  
**Description:** Checks the internal consistency of the model. Used for debugigng Mobius.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCompare  
  
  
**Description:** Compares two models. Used for grading models.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to compare this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## ModelMerge  
  
  
**Description:** Merges data from another model into this model.
This is the same as importing the model, except that no collection is created.  
  
**Parameters:**  
  * *input_data:* The location of the GI Model to import into this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## SendData  
  
  
**Description:** Post a message to the parent window.  
  
**Parameters:**  
  * *data:* The data to send, a list or a dictionary.  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
