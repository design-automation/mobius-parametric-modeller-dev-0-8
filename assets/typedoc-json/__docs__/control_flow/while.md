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