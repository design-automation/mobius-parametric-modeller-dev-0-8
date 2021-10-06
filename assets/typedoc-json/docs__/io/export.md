## io.Export  
  
  
**Description:** Export data from the model as a file.


If you expore to your  hard disk,
it will result in a popup in your browser, asking you to save the file.


If you export to Local Storage, there will be no popup.

  
  
**Parameters:**  
  * *entities:* Optional. Entities to be exported. If null, the whole model will be exported.  
  * *file\_name:* Name of the file as a string.  
  * *data\_format:* Enum, the file format.  
  * *data\_target:* Enum, where the data is to be exported to.  
  
**Returns:** void.  
**Examples:**  
  * io.Export (#pg, 'my_model.obj', obj)  
    Exports all the polgons in the model as an OBJ.
  
