## Exit
  
Inserts an `Exit` statement into the procedure. If an `Exit`statement is executed, the whole script will stop executing. If there are any other lines of code after the `Exit`, then those lines will not be executed. In addition, any other nodes in the flowchart will also not be executed. 

`Exit` statements can be inserted anywhere, including local functions.

`Exit` statements are typically placed inside an `If` condition, so that the whole script can exit gracefully under certain conditions.

The `Exit` statement has an argument, which is the value to be returned by the whole script. This value is is only relevant if the Mobius script is being called as a global function. If this is not the case, then `null` can be entered.