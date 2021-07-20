# LOCAL FUNCTION  
  
Inserts a local function into the procedure. The local function appears at the top of the procedure, inside the local function area. The function name appears in the left menu, below the `Def Func` button.

A local function is a custom function defined by you. Local functions can server two key purposes:
* Local functions allow you to break-down long and complex procedures into more manageable sub-procedures.
* In cases where one procedure needs to repeat certain operations, it allows you to avoid repeating the same code multiple times.

Clicking the `Def Func` button inserts an empty local function at the top of the procedure. The function has three parts:
* Name: The function name, for calling the function.
* Arguments: One or more function arguments. each argument must have a unique name. 
* Body: The code that makes up the body of the function. 

The function body can include a `Return` statement, in which case the function will return a value.

As soon as you create a new local function, you will see the name of that function appear in the left menu. Clicking the function name inserts a call to that function into the procedure. 

You can insert multiple calls to the same function. However, the function can only be called in the procedure within which it is define, i.e. it is specific to one node in teh flowchart. That is why it is called 'local'.

**Example**

Here is a screenshot of the user interface, showing two local function definitions and below that, in the main code, two function calls.

<img src="assets/typedoc-json/docCF/imgs/local_func_ui_code.png" width="411">

The two functions are as follows:

* The first function name is `addSum`. The function has one argument, called `list`. The function body contains one line of code, that calculates the sum of the list of numbers and then adds the result to the end of the list.

* The second function name is `squ`. The function has one argument, called `num`. The function body contains one line of code that calculates the square of the number, and returns the value.

The two function names are listed in the left menu. Clicking the function names will insert a function call into the code. 

<img src="assets/typedoc-json/docCF/imgs/local_func_ui_menu.png" width="106">

**Return Values**

A function can either return a value or not. In the example above, the first function returns no value and the second function return a value.

If a local function body contains no `Return` statement, then the function will not return any value. Such functions are usually used to modify some objects passed into the function via the arguments. 

If tha local function body contains a `Return` statement, then the function is assumed to return a value. In that case, calling the function will results in an assignment statement.

In the example:
* Calling the first function results in no assignment: `local.addSum([1,2,3])`.
* Calling the second function results in an assignment function: `result = local.squ(4)`.

If a local function needs to return more than one value, then either lists or dictionaries can be used. For example:
* Returning lists: `Return [value1, value2, value3]`
* Returning dictionaries: `Return {"name1": value1, "name2": value2}`

**Local Functions and Variables**

The variables defined in the main code of the procedure are not visible to the code in the local function. This means that any values that the function requires in order to perform its task need to be passed in as arguments to the function. 

Flowchart parameters are the exception to this rule. The flowchart parameters defined in the start node are visible anywhere, including inside local functions. However, these flowchart parameters are read only: their value cannot be changed.

**Moving Local Functions**

The order of local functions can be modified using the cut-and-paste keyboard shortcuts. (CTrl-X and CTRL-V on Windows, ⌘-X and ⌘-V on Macs).

The order of the functions makes no difference to the code execution.

**Copying Local Functions**

Local functions can be copied using the copy-and-paste keyboard shortcuts. (CTrl-C and CTRL-V on Windows, ⌘-C and ⌘-V on Macs).

Each local function must have a unique name. The new copied function will therefore be have `_copy` appended to the function name.

**Renaming Local Functions**

You can change the name of a local function at any time. Doing so will also update the function names in the left menu. 

In addition, renaming will also automatically update any existing calls to the function in the procedure.

**Deleting Local Functions**

Local functions can be deleted by selecting the function and pressing the `Delete` key.

Note that if the procedure still contains calls to the deleted function, then this will result in an error.


**Local Functions Calling Local Functions**

Local functions can also call other local functions. It just requires a function body to include a call to another function.

Note that the order of the local functions is not relevant. If function A calls function B, it does not matter if B is above or below A.