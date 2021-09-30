## Return
  
Inserts a `Return` statement into a local function or a procedure.

**Return in a Local Function**

For local functions, `Return` statements allow the function to return a value. 

The local function can have more than one `Return` statement. Once a `Return` statement is executed, the function will exit. If there are any other lines of code after the `Return`, then those lines will not be executed.

Below is an example of a function the divides `num1` by `num2`. If `num2` is zero, then the function returns `num1`. Otherwise, it will return the result of `num1 / num2`. 

![Example of a local function with two Return statements](assets/typedoc-json/docCF/imgs/return_func.png)
  
**Return in a Procedure**

For a procedure, `Return` will exit out of the procedure. If there are any other lines of code after the `Return`, then those lines will not be executed. Execution of the script will then continue on to the next node in the flowchart.

In procedures, `Return` statements are typically placed inside an `If` condition, so that the procedure can exit gracefully under certain conditions.

Note that for procedures, the `Return` statement does not return any value.

Below is an example of a procedure that extrudes some polygons using a `For-each` loop. The procedure first gets all the polygons in the model using the `#pg` expression. If the number of polygons is zero, then the `Return` statement is executed and the procedure exits. If not, then the polygons in the model are extruded.

![Example of a procedure with a Return statement](assets/typedoc-json/docCF/imgs/return_proc.png)