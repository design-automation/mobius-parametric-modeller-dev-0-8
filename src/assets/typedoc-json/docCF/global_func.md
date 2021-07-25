# GLOBAL FUNCTION  
  
Opens a dialog box for managing global functions.

A global function is a custom function defined by you. Global functions can server two key purposes:
* Global functions allow you to break-down long and complex flowchart into more manageable sub-flowcharts.
* In cases where multiple procedures in various nodes in the flowchart all need to repeat certain operations, global functions allows you to avoid repeating the same code multiple times.

A global function can be called in any procedure in any node. This differs from local functions, which can only be called in the node in which they are defined.

A global function is defined by importing another Mobius flowchart. 
* The function name will be the same as the name specified in the `Start` node of the imported Mobius flowchart. 
* The function arguments will be the same as the parameters of the imported Mobius flowchart (excluding any `Constant` parameters).
* The function code will be the combined code of all the nodes in the imported Mobius flowchart.

**Example**

Below is a diagram of a simple global function, showing the flowchart, the parameters in the `Start` node and the code in the `End` node. In this case, the flowchart has just a start node and an end node. However, note that global functions can be created from flowcharts with many nodes.

In this example, the flowchart performs a mathematical operation that takes a list of numeric values and calculates the square root of the sum of the square of each value in the list.

![Example of a flowchart that can be called as a global function](assets/typedoc-json/docCF/imgs/global_func_diag90.png)

This flowchart can be imported into another flowchart. The screenshot below shows the `Manage Global Functions` dialog box after the function has been imported. Importing copies the code from the imported Mobius file into the current Mobius file.

![Example of importing a global function](assets/typedoc-json/docCF/imgs/global_func_ui_manage.png)

After import, the global function now shows up in the list of functions in the left menu, below the `Manage` button. The function is now available and can be used in any node in the flowchart.

![List of global functions in the left menu](assets/typedoc-json/docCF/imgs/global_func_ui_menu.png)

Clicking the name of the global function will insert a function call into the procedure. The procedure call is show in the screenshot below. 

![Example of calling a global function](assets/typedoc-json/docCF/imgs/global_func_call.png)

The original flowchart file was called `SqrtSumSq.mob`, and the flowchart had just the one argument, called `LIST`. 

When the flowchart is converted to a function, the name of the function becomes `global.SqrtSumSq`. In addition, the function has a single argument, also called `LIST`. In the example, the value for this argument has  been set to `[1,2,3]`, which will result in a value of 3.74...

**Returning Values**

A function can either return a value or not. In the example above, the function returns a value.

![Global function return value](assets/typedoc-json/docCF/imgs/global_func_return.png)

The return value is set in the `End` node of the imported flowchart.
* If the `End` node has a value in the `Return` input box, then the global function will return a value. A call to such a global function will result in an assignment statement.
* If the `End` node has no value in the `Return` input box, then the global function will not return any value. A call to such a global function will not result in an assignment statement.

Just as with local functions, if a global function needs to return more than one value, list or dictionaries can be used. For example:
* Returning lists: `Return [value1, value2, value3]`
* Returning dictionaries: `Return {"name1": value1, "name2": value2}`

**Updating Global Functions**

When a global function needs to be edited, 

**Global Functions That Process Geometric Entities**

The procedure that calls a global function has access to the geometry in the Mobius model. We refer to this as the _main_ Mobius model,

Each time a procedure calls a global function, a new empty Mobius model is initialized for the code in the function to operate on. This new model is separate from the main model.

If the global function generates new geometric entities, then these entities will be automatically added to the main model. 

For example, a global function might be created for making a pyramid shape with a square base. The parameters of the function might be the `origin` of the pyramid, the `width` of the base, and the `height` of the pyramid. The polygons that get generated (including the topological entities and positions)  will automatically be added to the main model:

```
global.Pyramid(origin, width, height)
```
For  global functions that generate geometry, it is common for the function to return a list of IDs of generated entities. The IDs that are returned can then be used in downstream code for performing other operations. 

In the pyramid example, this would look like this:

```
pgons = global.Pyramid(origin, width, height)
```

In some cases, a global functions needs to process input  geometry. For example, in the case of the pyramid, it might be desirable to create a polygon where the input is a base polygon, and the function then generates a pyramid on that base.

This might look something like this, where `base` is the ID of the base polygon:

```
pgons = global.PyramidFromPolygons(base, height)
```
  
The problem is that the code in the global function does not have access to the geometric entities in the main model. So in the pyramid example, the code in the global function will not access to the base polygon.

To give a global function access to geometric entities that are passed in as an input, a `Basic Input` parameter has to be created in the `Start` node of the global function. In the settings for the parameter, the setting "Input entities for global function" needs to be ticked. This will ensure that the input entities are copied over to the new Mobius model that is initialized for the global function.

![Passing geometric entities into a global function](assets/typedoc-json/docCF/imgs/global_func_inputs.png)

**Testing Global Functions**

[to be completed]