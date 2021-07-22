## MENU

The Mobius Menu is available at the top of the browser window, as shown below:

<img src="assets/typedoc-json/docUI/imgs/menu2.png" width="309">

## NEW FILE

Create a new Mobius `.mob` script file. The default script will contain a flowchart, consisting of three nodes:
* A `Start` node.
* A middle node called `Node`. 
* An `End` node. 

The procedures in the nodes will all be empty. The script name in the start node will be `Untitled`.

## LOAD FILE

Load an existing Mobius `.mob` script file from your local drive. A dialog box will open up, allowing you to select the file to be loaded.

Loading a file will overwrite any existing script that is currently open. If required, first save the current script.

When the file is loaded, it will be automatically executed if auto-execute is enabled in the Settings. In some cases, it may be necessary to disable auto-execute, either because your script is very slow to execute or because your script has an error that crashed the browser (such as an infinite loop).

## SAVE FILE

Save a Mobius `.mob` script file to your local drive. A dialog box will open up, allowing you to set the file name and location where the file will be saved.

## SAVE TO LS

Save a Mobius `.mob` script file to the browser's Local Storage. A dialog box will pop up allowing you to specify a filename.

The Ctrl-s keyboard shortcut will save the currently open Mobius script to Local Storage.

**Auto-saving Backups**

Each time you execute a script, it is also automatically saved to Local Storage. The name of the file will be the name of the script, as defined in the `Start` node. If no name has been defined, then the filename will be `Untitled.mob`. This works as a backup that allows you to recover your script if the Mobius browser web pages closes unexpectedly or crashes and you have forgotten to save your file. Note that it will automatically overwrite any existing files in Local Storage with the same name.

Note that if you have multiple Mobius Modeller tabs open at the same time in the same browser, then they will all be sharing the same Local Storage. This means that if you have multiple models that are un-named, then they will all be saving to `Untitled.mob` each time you execute.

## SAVE JS

Convert the Mobius script to a plain Javascript file, and save the `.js` file to your local drive. A dialog box will open up, allowing you to set the file name and location where the file will be saved.

The Javascript version of the script can be embedded in websites or executed by other third-party programs. In order to be able to execute the Javascript, certain Mobius Javascript libraries will need to be loaded. For more information, see [xxx].

## SAVE MODEL

Generates a new script file with an embedded static model inside it. (This is mainly used for generating examples for modelling exercises, where the aim is to show the final result without revealing the script.)

First, the script is executed with the saved parameter settings. The final model from the `End` node of the flowchart is then extracted. A new script is then generated, with the static model inserted into the script. In the description of the new model, the parameter setting used to generate the model are described.

## LOCAL STORAGE

Opens a dialog box, showing the contents of Mobius Local Storage.

Web storage allows web applications to store data locally within the user's browser. Web storage is per origin, which means that all Mobius tabs in your browser can store and access the same data. Other website or web applications cannot access any of the data in Mobius Local Storage.

The dialog box for Local Storage consists of two tabs:
* _Mob Files_: A list of all Mobius scripts (.mob) in Local Storage.
* _Others_: A list of all other files in Local Storage.

Here is the 'Mob Files' tab, showing two Mobius scripts.

<img src="assets/typedoc-json/docUI/imgs/menu_local_storage_mob.png" width="558">

Here is the 'Others' tab, showing two data files.

<img src="assets/typedoc-json/docUI/imgs/menu_local_storage_other.png" width="558">

For both 'Mob Files' tab and 'Others' tab, three buttons are provided for:
* Add File: Adding files from the local drive
* Download File: Copy a file from Local Storage to your local drive.
* Delete File: Delete a file from Local Storage.

**Scripts That Read and Write Files**

Mobius scripts can read and write files when they are executed. Two functions are provided:
* `io.Read`: Can read from Local Storage or from a URL. It cannot read from the local drive. 
* `io.Write`: Can write to both the local drive outside the browser, and to Local Storage within the browser. 

For `io.Write`, the two options are as follows:
* Read/write to local drive outside the browser: Each time the `io.Write` function is executed, a dialog box will pop up, requiring the user to manually confirm the action. The script execution will pause until either 'OK' or 'Cancel' is clicked. 
* Read/write to Local Storage within the browser: The `io.Write` can read and write files without any dialog boxes popping up and without any user intervention.

If a script is reading or writing multiple files, then it is annoying for the person who is executing the script to keep having dialog boxes popping up. So in such cases, Local Storage is usually used.

**Updating Global Functions**

Another use fo Local Storage is updating global function. (For more information, see [Global Functions].)

When working with global functions, you may often need to edit that function for some reason. In such cases, you can have two Mobius script files open at the same time: the main script and the global function script. After making edits to the global function script, you can save it to Local Storage. Then, in the main script that calls the global function, you can open the global function manager and click the refresh button to update the global function.

<img src="assets/typedoc-json/docUI/imgs/menu_update_glob_func.png" width="600">

## PUBLISH

[to be completed]

## SETTINGS

Opens a dialog box to set various Mobius settings.

* Execute on file load: If ticked, Mobius script files will be executed automatically after they are loaded.
* Auto-save after executing: If ticked, Mobius script files will be automatically saved to Local Storage after they are executed. This means that any changes you have made since the last execution will be saved and backed up. 
* Display Mobius Functions: Shows a list of all the categories of the functions in Mobius. For each category, if it is ticked, then the functions in that category will be visible in the left vertical menu in the Editor tab.

**WebGL Hardware Acceleration**

At the bottom of the setting dialog box, you will see the hardware that you have available for WebGL rendering. For example, if you have an NVIDIA GEForce graphics card, it will show the details of that card.

Mobius renders and displays 3D models using a library called [WebGL](https://www.khronos.org/webgl/). This WebGL library can either use software rendering or hardware rendering. 

Hardware rendering will give you a significant performance boost. So it is important that your browser is set to use hardware rendering. For more information on how to do this, please Google it, or check out this site: [setting WebGL to use hardware acceleration](https://support.biodigital.com/hc/en-us/articles/218322977-How-to-turn-on-WebGL-in-my-browser).

For the Chrome browser, here an example of what you should see if you type `chrome://gpu` in the browser. In particular, the last two line, `WebGL` and `WebGL2` should be set to `Hardware accelerated`.

<img src="assets/typedoc-json/docUI/imgs/menu_chrome_gpu.png" width="414">

**Select Graphics Card**

If you are using a laptop, then you may have two graphics cards. High-end laptops will often have an integrated graphics card and a high performance graphics card. The high performance graphics card (such as NVIDIA, Broadcom, AMD etc) will use more power, and will therefore drain your battery more quickly. Laptops will usually have default settings for browser to to use the integrated graphics, to save on battery. However, in order to get the best performance out of Mobius, you should change the default settings for your browser to use your high-performance graphics card.

How to do this will depends on your graphics card, so you may need to Google it. For NVIDIA, you can open the NVIDIA Control Panel on you laptop, and go to `Manage 3D settings > Program Settings` as shown in the image below. In this example, we set `Google Chrome` to use the `High-performance NVIDIA processor`.

<img src="assets/typedoc-json/docUI/imgs/menu_nvidia.png" width="670">



