# MENU

## NEW FILE

Create a new Mobius `.mob` script file. The default script will contain a flowchart, consisting of three nodes:
* A `Start` node.
* A middle node called `Node`. 
* An `End` node. 

The procedures in the nodes will all be empty. The script name in the start node will be `Untitled`.

## LOAD FILE

Load an existing Mobius `.mob` script file from your local drive. A dialog box will open up, allowing you to select the file to be loaded.

Loading a file will overwrite any existing script that is currently open. If required, first save the current script.

## SAVE FILE

Save a Mobius `.mob` script file to your local drive. A dialog box will open up, allowing you to set the file name and location where the file will be saved.

## SAVE TO LS

Save a Mobius `.mob` script file to the browser's local storage. A dialog box will pop up allowing you to specify a filename.

Note that each time you execute a script, it is also automatically saved to local storage. The name of the file will be the name of the script, as defined in the `Start` node. If no name has been defined, then the filename will be `Untitled.mob`. This works as a backup that allows you to recover your script if the Mobius browser web pages closes unexpectedly or crashes and you have forgotten to save your file. Note that it will automatically overwrite any existing files in local storage with the same name. 

## SAVE JS

Convert the Mobius script to a plain Javascript file, and save the `.js` file to your local drive. A dialog box will open up, allowing you to set the file name and location where the file will be saved.

The Javascript version of the script can be embedded in websites or executed by other third-party programs. In order to be able to execute the Javascript, certain Mobius libraries will need to be loaded. For more information, see [xxx].

## SAVE MODEL

Generates a new script file with an embedded static model inside it. (This is mainly used for generating examples for modelling exercises, where the aim is to show the final result without revealing the script.)

First, the script is executed with the saved parameter settings. The final model from the `End` node of the flowchart is then extracted. A new script is then generated, with the static model inserted into the script. In the description of the new model, the parameter setting used to generate the model are described.

## LOCAL STORAGE

[to be completed]

## PUBLISH

[to be completed]

## SETTINGS

[to be completed]

