## EDITOR  

The _Editor_ pane is for editing the procedures for each of the nodes in your flowchart.

The name of the node being edited is displayed at the top of the Editor pane, next to the execute button. In the example below, the procedure for a node called `Second node` is bing edited.

![Node name](assets/typedoc-json/docUI/imgs/editor_node_name.png)

Navigating between the procedures for the different nodes in the flowchart can be accomplished in two ways. 
* Clicking the node name will display a drop down menu, from which you can select a different node in the flowchart. 
* From the Flowchart pane, double clicking any node in the flowchart will take you the the procedure for that node.

The image below shows the dropdown menu. The flowchart has a `Start` node and `End` node, and two additional nodes, called `First Node` and `Second Node`.

![Node name dropdown menu](assets/typedoc-json/docUI/imgs/editor_node_menu.png)

In the editor, two sections will be visible: 'Local Functions' and 'Procedure'. Here we will focus on how to create procedures. For more information see the help sections on [Local Functions] and [Global Functions].

**Creating Procedures**

The Editor uses a 'click-and-fill-in-the-blanks' approach to coding. The advantage of this approach is that it significantly reduces syntax errors and memorizing syntax (such as function names).

On the left side, the vertical menu has a set of buttons that allow you to insert lines of code into your procedure. The line of code is always inserted below the currently selected line. Note that if no line is selected, you will not be able to insert any new lines of code.

The vertical menu is divided into four sections as follows:
* _Variable/Comment_: Two buttons, for inserting assignment statements and inserting comments.
* _Expressions_: A button for creating expressions, which opens up a separate dialogue box for constructing expressions.
* _Control Flow_: A collapsible menu that contains a list of buttons for inserting control flow statements.
* _Functions_: A collapsible menu with a list of functions, divided into categories. 

The buttons on the vertical menu have help that pop up when you hover with your mouse. In addition, click the '?' icon next to the button will open up a more detailed help page in the docs viewer.

Below is an example of hovering over one of the function names, with the popup shows an abbreviated help message.

![Help for functions](assets/typedoc-json/docUI/imgs/editor_function_help.png)

**Lines of Code**

Each line of code consists of a rectangular area with a number of input boxes. Below is an example of a small procedure that generates a torus. I 

![An example procedure](assets/typedoc-json/docUI/imgs/editor_torus_procedure.png)

Lines of code have background colour based on their type, as follows:
* Control flow statements: light purple
* Return, Exit, and Break-branch statements: light red
* Assignment statements: light blue
* Built-in function calls: light orange
* Local functions: light green
* Global function calls: light teal
* Comments: light grey
* Selected: blue

For lines of code that call functions, the input boxes allow you to specify the parameter values for the arguments to the function. Certain functions may have arguments that are defined as dropdown menus, so that you can select an option. For example, the `make.Polyline` function has two arguments: the first is a list of positions for the polyline, and the second is a dropdown menu to specify whether the polyline should be open or closed. 

![A function argument with a dropdown](assets/typedoc-json/docUI/imgs/editor_dropdown_input.png)

Each line of code has some buttons on the right hand side. These buttons only become visible when hovering or when a line of code is selected. 

![Buttons for lines of code](assets/typedoc-json/docUI/imgs/editor_break_print_disable.png)

In the example, the first line of code is selected, and three toggle buttons are visible. Each of these toggle buttons can be switch on/off by clicking on the button. The three toggle buttons do the following when switched on:
* _Terminate Script_: Terminates the execution of the while script. This means that any lines of code below this line will not be executed. Procedures in any downstream nodes will also not get executed. 
* _Print Result in Console_: If a value is assigned to a variable, then the value is printed to the Console viewer (explain in more detail below).
* _Disable Line_: The line of code is completely ignore and will not be executed. Subsequent lines will executed as usual. 

If a line of code does not assign any value to a variable, then 'Print' button is not shown. Only the 'Terminate' and 'Disable' buttons will be shown.

In the example, in the lines of code after the first line, we can see that following toggles have been switched on:
* The `modify.Move` line has the 'Terminate' button switched on. The left and bottom edges of the line of code are highlighted in a XXX colour. 
* The `make.Polyline` line has the 'Print' button switched on. The left and bottom edges of the line of code are highlighted in a XXX colour. 
* The `local.copyRadial` line has the 'Disable' button switched on. The line of code is grayed out. 

Finally, a syntax error has also now appeared in the `make.Loft` line of code. The first argument of the `make.Loft` function is a list of entities to loft. The value that has been entered is `circs`, but the input box has a red edge, sowing that there is a syntax error. The reason for this error is due to the fact that the line above has been disabled. It is this line that creates the `circs` variable, so when it is disables, any code below that use this variable will get highlighted as having syntax errors.

**Printing**

Each time a flowchart is executed, some text is shown in the Console viewer. The process of adding text to the Console viewer is referred to as 'printing'.

This Console viewer gives you feedback on the process of execution of the procedures in all the nodes in the flowchart. By default, it dynamically prints the amount of time it took to execute the procedure in each node. The 'Print' toggle allows you to print additional information. This additional information can give you a better understand what is happening while your script is executing. 

When the 'Print' toggle button on a line of code is switched on, then the value being assign to the variable in that line of code gets printed. Below is an example of printing a value of a variable.

![Printing variables](assets/typedoc-json/docUI/imgs/editor_print_variable.png)

In this case, the variable being printed is called `circs` and the value that is printed in the Console viewer is `['pl','p2','p3','p4','p5','p6']` (i.e. a list of IDs of polylines).

Below is a second example of printing, this time in a loop. Two 'Print ' toggle buttons have been switched on: the 'Print' on the `For-each` loop, and the 'Print' on the `make.Copy` line of code. 

![Printing variables in a loop](assets/typedoc-json/docUI/imgs/editor_print_loop.png)

In this case, each time the `For-each` loop is executed, some information printed to the Console viewer. The `For-each` line prints `_Executing For-each: i = 0`. Then the `makeCOpy` line prints `_ent_copy = 'pl1'`. Then it repeats six times.

**Popup Messages**

While editing your procedure, various type sof messages will pop up in the right hand corner of the screen. These messages give additional feedback on certain operations. The message will show for 5 seconds and then disappear.

Here is an example of a popup message that appears when you try to insert a line of code, but you forget to select the place where the line should be inserted. 

![Popup message when inserting a line of code](assets/typedoc-json/docUI/imgs/editor_popup_insert.png)

Here is an example of a popup message that appears when you make a syntax error. 

![Popup message when you get a syntax error](assets/typedoc-json/docUI/imgs/editor_popup_syntax_error.png)

**Runtime Errors**

Code can have two main types of errors: syntax errors and runtime errors. Syntax errors are highlighted before the code is executed, by creating a red outline around the input box where the error occurs (as shown above). Runtime errors on the other hand only become apparent when the code is executed.

For runtime errors, the line of code where the error occurred is highlighted, and an error message will appear in the Console. Below is an example of a runtime error. 

![Example of a runtime error](assets/typedoc-json/docUI/imgs/editor_runtime_error.png)

**Cut, Copy, Paste, Undo**

Code can be cut, copied, and pasted using the usual keyboard shortcuts. In addition, operations can also be undone.
* Cut: Ctrl-x on Windows (⌘-x on Macs)
* Copy: Ctrl-c on Windows (⌘-c on Macs)
* Paste: Ctrl-v on Windows (⌘-v on Macs)
* Undo: Ctrl-z on Windows (⌘-z on Macs)

When cutting or copying, Mobius keeps track of three different types of cut/copied information: nodes, lines of code, and text expressions.  

For example, let's say you do the following:

1. In the Flowchart pane, you select a node in the flowchart and Ctrl-c.
1. You then switch over to the Editor pane, select a line of code and Ctrl-c.
1. Then you select some text in one of the input boxes, and Ctrl-c.

You will now have three pieces of copied information, saved separately. when you paste using Ctrl-v, Mobius will always paste the correct type of information, depending on the pane that is selected and the focus of the mouse. 

* If the Flowchart pane is selected, then Ctrl-v will paste the copied node. 
* If a line of code is selected in the Editor pane, then Ctrl-v will paste the copied line of code.
* If the mouse focus is inside an input box in the Editor pane, then Ctrl-v will paste the text expression.

The logic is similar for the undo keyboard shortcut.

* If the Flowchart pane is selected, then Ctrl-z will undo the most recent operation performed on the flowchart. 
* If the Editor pane open (and the mouse focus is inside an input box) , then Ctrl-z will undo the most recent operation performed on the lines of code in the editor. 
* If the mouse focus is inside an input box in the Editor pane, then Ctrl-z will undo the most recent text edit (in any of the input boxes).

**Script Parameters**

The variables defined in a procedure are all local. This means that the code in one node cannot access any of the variables defined in another node. 

The exception to this is the script parameters, defined in the `Start` node. The values set for these parameters can be read by any procedure. However, note that these parameters are read only. The procedures in other downstream nodes after the `Start` cannot change the values for the script parameters. 

Below is an example of a script that defines two parameters in the start node: called `SEGMENTS` and `SLICES`. Note that script parameters are automatically converted to uppercase, in order to visually differentiate them for local variables.

![Script parameters defined in teh Start node](assets/typedoc-json/docUI/imgs/editor_set_params.png)

Below is an example of how these two variables are used within the procedure. `SEGMENTS` is used as one of the arguments to the `pattern.Arc` function. `SLICES` is used as one of the arguments to the `local.copyRadial` function. (The code in the body of the `local.copyRadial` function could also directly read the parameter value. However, in some cases specifying the parameter as an argument may make the code more readable and easier to understand.)

![Script parameters used in the code](assets/typedoc-json/docUI/imgs/editor_read_params.png)
