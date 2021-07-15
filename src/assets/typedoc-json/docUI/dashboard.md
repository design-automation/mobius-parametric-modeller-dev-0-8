## DASHBOARD  
  
The dashboard tab shows a description and parameters for the currently loaded script.

The dashboard description and dashboard parameters are defined in the `Start` node of the flowchart. The dashboard user-interface is designed for users who may be non-technical and who may prefer not to see any code. Such users can view the description, adjust the parameter values, click the 'Play' button, and view the resulting model without having to look at any code.

**Script Description**

The script description can be used to give an overview of the script. This description can be useful for a user who is not familiar with the script to understand the type sof models that the script generates.

**Script Parameters**

The following parameter types will be displayed in the parameters tab.
* `Basic Input` parameters have a simple input box where a value can be typed. If a `Basic Input` parameter has the "Input entities for global function" ticked, then the  parameter will not be shown in the dashboard. 
* `Slider` parameters have a slider for defining numeric values. The step size, minimum value, and maximum value of the slider are defined by the parameter settings.
* `Checkbox` parameters have a checkbox for defining boolean values (true or false).
* `Dropdown` parameter have a dropdown menu that allow a specific value to be selected from a list of possible values. The list of values is define in the parameter settings in the `Start` node.

Note that `Constant` parameters are not shown in the dashboard. For these parameters, the values is assumed to be a constant that should be non-editable. 

**Parameter Names**

In the `Start` node, each parameter has a description and a name, which is capitalized. The display in the dashboard is as follows:
* If the parameter description is empty, then the capitalized parameter name is displayed.
* If the parameter description is not empty, then the description will be displayed (and the capitalized parameter name will be hidden).

Typically, the capitalized parameter name may not be understandable to a user who is unfamiliar with the script. Is is therefore recommended to always add descriptions to your parameters. Such descriptions should explain what the parameter does.

**Html Formatting**

[to be completed]
  