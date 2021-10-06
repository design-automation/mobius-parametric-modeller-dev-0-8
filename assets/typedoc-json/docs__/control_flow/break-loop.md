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