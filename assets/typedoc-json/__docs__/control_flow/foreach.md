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