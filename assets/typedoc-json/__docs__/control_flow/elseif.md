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