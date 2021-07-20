## EDITOR  

The _Editor_ tab is for editing the procedures for each of the nodes in your flowchart.

The name of the node being edited is displayed at the top of the Editor tab, next to the execute button. In the example below, the procedure for a node called `Second node` is bing edited.

<img src="assets/typedoc-json/docUI/imgs/editor_node_name.png" width="538">

Navigating between the procedures for the different nodes in the flowchart can be accomplished in two ways. 
* Clicking the node name will display a drop down menu, from which you can select a different node in the flowchart. 
* From the Flowchart tab, double clicking any node in the flowchart will take you the the procedure for that node.

The image below shows the dropdown menu. The flowchart has a `Start` node and `End` node, and two additional nodes, called `First Node` and `Second Node`.

<img src="assets/typedoc-json/docUI/imgs/editor_node_menu.png" width="225">

In the editor, two sections will be visible: 'Local Functions' and 'Procedure'. Here we will focus on how to create procedures. For more information on using functions, see:
* Local Functions [ToDo create link]
* Global Functions [ToDo create link]

**Creating Procedures**

The Editor uses a 'click-and-fill-in-the-blanks' approach to coding. The advantage of this approach is that it significantly reduces syntax errors and memorizing syntax (such as function names).

On the left side, the vertical menu has a set of buttons that allow you to insert lines of code into your procedure. The line of code is always inserted below the currently selected line. Note that if no line is selected, you will not be able to insert any new lines of code.

The vertical menu is divided into four sections as follows:
* _Variable/Comment_: Two buttons, for inserting assignment statements and inserting comments.
* _Expressions_: A button for creating expressions, which opens up a separate dialogue box for constructing expressions.
* _Control Flow_: A collapsible menu that contains a list of buttons for inserting control flow statements.
* _Functions_: A collapsible menu with a list of functions, divided into categories. 

The buttons on the vertical menu have help that pop up when you hover with your mouse. In addition, click the '?' icon next to teh button will open up a more detailed help page in the docs viewer.

Below is an example of hovering over one of the function names, with the popup shows an abbreviated help message.

<img src="assets/typedoc-json/docUI/imgs/editor_function_help.png" width="530">

**Filling in the blanks**

[ToDo to be completed]

**Cut, Copy, Paste, Undo**

Code can be cut, copied, and pasted using the usual keyboard shortcuts. In addition, operations can also be undone.
* Cut: Ctrl-x on Windows (⌘-x on Macs)
* Copy: Ctrl-c on Windows (⌘-c on Macs)
* Paste: Ctrl-v on Windows (⌘-v on Macs)
* Undo: Ctrl-z on Windows (⌘-z on Macs)

When cutting or copying, Mobius keeps track of three different types of cut/copied information: nodes, lines of code, and text expressions.  

For example, let's say you do the following:

1. In the Flowchart tab, you select a node in the flowchart and Ctrl-c.
1. You then switch over to the Editor tab, select a line of code and Ctrl-c.
1. Then you select some text in one of the input boxes, and Ctrl-c.

You will now have three pieces of copied information, saved separately. when you paste using Ctrl-v, Mobius will always paste the correct type of information, depending on the tab that is selected and the focus of the mouse. 

* If the Flowchart tab is selected, then Ctrl-v will paste the copied node. 
* If a line of code is selected in the Editor tab, then Ctrl-v will paste the copied line of code.
* If the mouse focus is inside an input box in the Editor tab, then Ctrl-v will paste the text expression.

The logic is similar for the undo keyboard shortcut.

* If the Flowchart tab is selected, then Ctrl-z will undo the most recent operation performed on the flowchart. 
* If the Editor tab open (and the mouse focus is inside an input box) , then Ctrl-z will undo the most recent operation performed on the lines of code in the editor. 
* If the mouse focus is inside an input box in the Editor tab, then Ctrl-z will undo the most recent text edit (in any of the input boxes).

**Saving Files**

[ToDo to be completed]