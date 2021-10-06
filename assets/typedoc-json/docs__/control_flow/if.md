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