## Break-branch

Inserts a `Break-branch` statement into the procedure. If an `Break-branch`statement is executed, the current branch in the flowchart will stop executing. If there are any other lines of code after the `Break-branch`, then those lines will not be executed. In addition, downstream nodes in the same branch will also not be executed but nodes in other branches will be executed.

Below is an example of a flowchart with two branches. The `create skeleton` node creates a set of polylines for generating a model. The left branch then consists of two nodes: the `loft polygons` creates some polygons using the loft operation; the `extrude polygons` node then extrudes those polygons to give them a thickness. The right branch has just a single node that creates some beams.

![Examples of a flowchart with two branches](assets/typedoc-json/docCF/imgs/break_branch.png)

The procedure inside the `loft polygons` node first checks if at least two polylines have been found in the incoming model. If the number of polylines is less than two, then a `Break-branch` statement is executed. This will result in the `extrude polygons` node being skipped. However, the nodes in the right branch (in this case, `create beams`) and the `End` node will all still be executed. 

![Example of a procedure with a Break-branch statement](assets/typedoc-json/docCF/imgs/break_branch_proc.png)