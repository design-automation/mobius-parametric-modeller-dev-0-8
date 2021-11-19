## io.Import  
  
  
**Description:** Imports data into the model.


There are two ways of specifying the file location to be imported:
- A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
- A file name in the local storage, e.g. "my_data.obj".


To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
Note that a script using a file in local storage may fail when others try to open the file.

  
  
**Parameters:**  
  * *data\_url:* The url to retrieve the data from  
  * *data\_format:* Enum, the file format.  
  
**Returns:** A list of the positions, points, polylines, polygons and collections added to the model.  
**Examples:**  
  * io.Import ("my_data.obj", obj)  
    Imports the data from my_data.obj, from local storage.
  
