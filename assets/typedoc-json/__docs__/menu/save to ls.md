## SAVE TO LS

Save a Mobius `.mob` script file to the browser's Local Storage. A dialog box will pop up allowing
you to specify a filename.

The Ctrl-s keyboard shortcut will save the currently open Mobius script to Local Storage.

**Auto-saving Backups**

Each time you execute a script, it is also automatically saved to Local Storage. The name of the
file will be the name of the script, as defined in the `Start` node. If no name has been defined,
then the filename will be `Untitled.mob`. This works as a backup that allows you to recover your
script if the Mobius browser web pages closes unexpectedly or crashes and you have forgotten to save
your file. Note that it will automatically overwrite any existing files in Local Storage with the
same name.

Note that if you have multiple Mobius Modeller tabs open at the same time in the same browser, then
they will all be sharing the same Local Storage. This means that if you have multiple models that
have the same name or are unnamed, then they will all be saving to `Untitled.mob` each time you
execute.