## io.ExportData  
  
  
**Description:** Export data from the model as a string.

  
  
**Parameters:**  
  * *entities:* Optional. Entities to be exported. If null, the whole model will be exported.  
  * *data\_format:* Enum, the file format.  
  
**Returns:** the model data as a string.  
**Examples:**  
  * io.Export (#pg, 'my_model.obj', obj)  
    Exports all the polgons in the model as an OBJ.
  
