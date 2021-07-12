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

The body of the loop can be executed zero or more times, depending on teh initial value of `a`. 
* If that starting value of `a` is greater than or equal to 100, then the body will never be executed. 
* If the starting value of `a` is less than 100, then the body will be executed one or more times. Since the value of `a` keeps increasing, it will eventually become equal to 100, at which point the loop will exit. 

## Break-loop
  
Inserts a `Break-loop` statement into the body of either a `For-each` loop or a `While` loop. 

When the `Break-loop` is executed, execution will break out of the loop and procedure to the next line of code immediately after the loop statement. 

The `Break-loop` statement is typically nested inside a conditional `If` statement.  
  
## Continue-loop
  
Inserts a `Continue-loop` statement into the body of either a `For-each` loop or a `While` loop. 

When the `Continue-loop` is executed, execution will skips the subsequent lines of code in the loop body and continue with the next iteration of the loop. 

The `Continue-loop` statement is typically nested inside a conditional `If` statement.  
  
## Return
  
Inserts a `Return` statement into the procedure.

... either the body of a procedure or the body of a local function.
  
## Exit
  
Inserts an `Exit` statement into the procedure.

... either the body of a procedure or the body of a local function.
  
## Break-branch

Inserts a `Break-branch` statement into the procedure. 

... either the body of a procedure or the body of a local function
  
<img src="assets/typedoc-json/docCF/diags.png" width="500">
<img src="assets/typedoc-json/docCF/diags.png" width="400">
<img src="assets/typedoc-json/docCF/diags.png" width="300">