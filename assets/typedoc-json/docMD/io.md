# IO  
  
The `io` module has functions for importing and exporting.  
  
  
## Read  
  
  
**Description:** Read data from a Url or from local storage.  
  
**Parameters:**  
  * *data:* The data to be read (from URL or from Local Storage).  
  
**Returns:** the data.  
  
  
## Write  
  
  
**Description:** Write data to the hard disk or to the local storage.  
  
**Parameters:**  
  * *data:* The data to be saved (can be the url to the file).  
  * *file\_name:* The name to be saved in the file system (file extension should be included).  
  * *data\_target:* Enum, where the data is to be exported to.  
  
**Returns:** whether the data is successfully saved.  
  
  
## Import  
  
  
**Description:** Imports data into the model.


There are two ways of specifying the file location to be imported:
- A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
- A file name in the local storage, e.g. "my_data.obj".


To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
Note that a script using a file in local storage may fail when others try to open the file.

  
  
**Parameters:**  
  * *input\_data:* undefined  
  * *data\_format:* Enum, the file format.  
  
**Returns:** A list of the positions, points, polylines, polygons and collections added to the model.  
**Examples:**  
  * io.Import ("my_data.obj", obj)  
    Imports the data from my_data.obj, from local storage.
  
  
  
## Export  
  
  
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
  
  
  
## Geolocate  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.  
  
**Parameters:**  
  * *lat\_long:* Set the latitude and longitude of the origin of the Cartesian coordinate system.  
  * *rot:* Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  
  
  
## Geoalign  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.


The Cartesian coordinate system is geolocated by defining two points:
- The latitude-longitude of the Cartesian origin.
- The latitude-longitude of a point on the positive Cartesian X-axis.

  
  
**Parameters:**  
  * *lat\_long\_o:* Set the latitude and longitude of the origin of the Cartesian coordinate
system.  
  * *lat\_long\_x:* Set the latitude and longitude of a point on the x-axis of the Cartesian
coordinate system.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  
  
  
## LatLong2XYZ  
  
  
**Description:** Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
based on the geolocation of the model.  
  
**Parameters:**  
  * *lat\_long:* Latitude and longitude coordinates.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** XYZ coordinates  
  
  
