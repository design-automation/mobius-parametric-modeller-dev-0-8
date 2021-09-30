## LOCAL STORAGE

Opens a dialog box, showing the contents of Mobius Local Storage.

Web storage allows web applications to store data locally within the user's browser. Web storage is
per origin, which means that all Mobius tabs in your browser can store and access the same data.
Other website or web applications cannot access any of the data in Mobius Local Storage.

The dialog box for Local Storage consists of two tabs:
* _Mob Files_: A list of all Mobius scripts (.mob) in Local Storage.
* _Others_: A list of all other files in Local Storage.

Here is the 'Mob Files' tab, showing two Mobius scripts.

![Mobius files in Local Storage](assets/typedoc-json/docUI/imgs/menu_local_storage_mob.png)

Here is the 'Others' tab, showing two data files.

![Data files in Local Storage](assets/typedoc-json/docUI/imgs/menu_local_storage_other.png)

For both 'Mob Files' tab and 'Others' tab, three buttons are provided for:
* Add File: Adding files from the local drive
* Download File: Copy a file from Local Storage to your local drive.
* Delete File: Delete a file from Local Storage.

**Scripts That Read and Write Files**

Mobius scripts can read and write files when they are executed. Two functions are provided:
* `io.Read`: Can read from Local Storage or from a URL. It cannot read from the local drive. 
* `io.Write`: Can write to both the local drive outside the browser, and to Local Storage within the
  browser. 

For `io.Write`, the two options are as follows:
* Read/write to local drive outside the browser: Each time the `io.Write` function is executed, a
  dialog box will pop up, requiring the user to manually confirm the action. The script execution
  will pause until either 'OK' or 'Cancel' is clicked. 
* Read/write to Local Storage within the browser: The `io.Write` can read and write files without
  any dialog boxes popping up and without any user intervention.

If a script is reading or writing multiple files, then it is annoying for the person who is
executing the script to keep having dialog boxes popping up. So in such cases, Local Storage is
usually used.

**Updating Global Functions**

Another use of Local Storage is updating global function. (For more information, see [Global
Functions].)

When working with global functions, you may often need to edit that function for some reason. In
such cases, you can have two Mobius script files open at the same time: the main script and the
global function script. After making edits to the global function script, you can save it to Local
Storage. Then, in the main script that calls the global function, you can open the global function
manager and click the refresh button to update the global function.

![Updating global functions](assets/typedoc-json/docUI/imgs/menu_update_glob_func.png)