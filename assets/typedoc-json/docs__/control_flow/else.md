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