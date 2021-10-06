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