# CONTROL FLOW  
  
## If

Inserts a conditional `If` statement into the procedure.

The `If` statement has a condition and a body. The body of the `If` statement is only executed if the condition evaluates to `true`. In this example, the condition is `a > 30`, and the body has just one line of code, `b = 0`.

```
If a > 30 
    b = 0
```

The condition can contain any expression that evaluates to `true` or `false`. All numbers (including negative numbers) evaluate to `true` except zero, which evaluates to `false`. 

**Compound Conditional Statements**

An `If` statement can be followed by an `Else-if` or `Else` statement. This results in a compound conditional statement. Here is an example of a compound conditional statement:

```
If a > 30 
    b = 0
Else-if a > 20
    b = 1
Else-if a > 10 
    b = 2
Else
    b = 3
```

In the above example:
* If `a` was 35, then `b` would be set to 0. The other statements after the `If` would be skipped, 
* If `a` was 25, then `b` would be set to 1. The second `Else-if` and the `Else` would be skipped.
* If `a` was 15, then `b` would be set to 2. The  `Else` would be skipped.
* If `a` was 5, then `b` would be set to 3. 

Note that for a compound conditional statement:
* It must contain exactly one `If` statement. It must come at the start.
* It can contain zero or more `Else-if` statements.
* It can contain zero or one `Else` statements. If there is an `Else`, then it must come at the end.

**Nested Conditional Statements**

Conditional statements can also be nested. Here is an example of how the previous compound conditional statement can be nested inside an `If` statement.

```
If name == "abc"
  If a > 30 
      b = 0
  Else-if a > 20
      b = 1
  Else-if a > 10 
      b = 2
  Else
      b = 3
```

In the left menu, the `Else-if` and `Else` will be disabled unless the currently selected line is either an `If` statement or an `Else-if` statement.

## Elseif
  
Inserts a conditional `Else-if` statement into the procedure.

An `Else-if` statement must be part of a compound conditional `If` statement. 

The `Else-if` statement must directly follow either an `If` statement or another `Else-if` statement.

The `Else-if` statement has a condition and a body. The body will be executed if:
* the preceding conditions in the compound conditional all evaluated to `false`, and
* the current condition evaluates to `true`.

Here is an example:

```
If a > 30 
    b = 0
Else-if a > 20
    b = 1
Else-if a > 10 
    b = 2
Else
    b = 3
```

## Else
  
Inserts a conditional `Else` statement into the procedure.

An `Else` statement must be part of a compound conditional `If` statement. 

The `Else` statement must directly follow either an `If` statement or another `Else-if` statement.

The `Else` statement must come at the end of a compound conditional statement. (It cannot be followed by an `Else-if` statement.)

The `Else` statement has a body, but has no condition. The body will be executed if all preceding conditions in the compound conditional evaluated to `false`.

Here is an example:

```
If a > 30 
    b = 0
Else-if a > 20
    b = 1
Else-if a > 10 
    b = 2
Else
    b = 3
```
  
## Foreach
  
Inserts a `For-each` loop statement into the procedure.

The `For-each` statement loops over items in a list. The loop statement has a variable name, a list to loop over, and a body. The body of the loop can be executed zero or more times.

Here is an example: 

```
For-each i in [1,2,3,4,5]
    a = 10 * i
    b = a * a
```

In the above example, the variable name is `i`. The list to loop over is `[1,2,3,4,5]`. The body contains two lines of code, setting the values of `a` and `b`. The body will be executed five times.
* The first loop iteration, `i` is 1, `a` is set to `10`, and `b` to 100.
* The first loop iteration, `i` is 2, `a` is set to 20, and `b` to 400.
* and so forth...

If the list is empty, then the loop body will never be executed.

It is possible for the code in the body of the loop to modify the list that is being iterated over. However, this is generally not good practice, as it can easily result in errors and bugs.
  
## While
  
Inserts a `While` loop statement into the procedure. 

The `While` statement has a condition and a body. The loop will repeatedly execute the body while the condition remains true. (Note that there is a danger of an infinite loop.)

Here is an example:

```
While a < 100
    b = b + (a * a)
    a = a + 1
```

The condition is `a < 100`, and the body consists of two lines: `b = b + (a * a)` and `a = a + 1`. 

The body of the loop can be executed zero or more times, depending on the initial value of `a`. 
* If that starting value of `a` is greater than or equal to 100, then the body will never be executed. 
* If the starting value of `a` is less than 100, then the body will be executed one or more times. Since the value of `a` keeps increasing, it will eventually become equal to 100, at which point the loop will exit. 

## Break-loop
  
Inserts a `Break-loop` statement into the body of either a `For-each` loop or a `While` loop. 

When the `Break-loop` is executed, execution will break out of the loop and procedure to the next line of code immediately after the loop statement. 

The `Break-loop` statement is typically nested inside a conditional `If` statement.

Here is a simple example:

```
total = 0
For-each i in range(10)
    If i > 5
        Break-loop
    total = total + i
```

In this case, the loop body will be executed 6 times (from `i = 0` to `i = 5`). On the 7th iteration, when `i` gets to 6, the loop exits. The result for `total` will be 15.
  
## Continue-loop
  
Inserts a `Continue-loop` statement into the body of either a `For-each` loop or a `While` loop. 

When the `Continue-loop` is executed, execution will skips the subsequent lines of code in the loop body and continue with the next iteration of the loop. 

The `Continue-loop` statement is typically nested inside a conditional `If` statement.  


Here is a simple example:

```
total = 0
For-each i in range(10)
    If i < 5
        Continue-loop
    total = total + i
```

In this case, the loop body will be executed 10 times (from `i = 0` to `i = 9`). However, for the first five iterations, when `i` is less than 5, the last line of the loop body will not be executed. The result for `total` will be 35.

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
  
## Break-branch

Inserts a `Break-branch` statement into the procedure. If an `Break-branch`statement is executed, the current branch in the flowchart will stop executing. If there are any other lines of code after the `Break-branch`, then those lines will not be executed. In addition, downstream nodes in the same branch will also not be executed but nodes in other branches will be executed.

Below is an example of a flowchart with two branches. The `create skeleton` node creates a set of polylines for generating a model. The left branch then consists of two nodes: the `loft polygons` creates some polygons using the loft operation; the `extrude polygons` node then extrudes those polygons to give them a thickness. The right branch has just a single node that creates some beams.

![Examples of a flowchart with two branches](assets/typedoc-json/docCF/imgs/break_branch.png)

The procedure inside the `loft polygons` node first checks if at least two polylines have been found in the incoming model. If the number of polylines is less than two, then a `Break-branch` statement is executed. This will result in the `extrude polygons` node being skipped. However, the nodes in the right branch (in this case, `create beams`) and the `End` node will all still be executed. 

![Example of a procedure with a Break-branch statement](assets/typedoc-json/docCF/imgs/break_branch_proc.png)

## Exit
  
Inserts an `Exit` statement into the procedure. If an `Exit`statement is executed, the whole script will stop executing. If there are any other lines of code after the `Exit`, then those lines will not be executed. In addition, any other nodes in the flowchart will also not be executed. 

`Exit` statements can be inserted anywhere, including local functions.

`Exit` statements are typically placed inside an `If` condition, so that the whole script can exit gracefully under certain conditions.

The `Exit` statement has an argument, which is the value to be returned by the whole script. This value is is only relevant if the Mobius script is being called as a global function. If this is not the case, then `null` can be entered.


  


  
