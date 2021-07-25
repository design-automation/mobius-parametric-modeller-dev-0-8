# EXPRESSION  
  
Opens up the _Expression Builder_ dialog box for creating expressions.

![The Expression builder dialog box](assets/typedoc-json/docCF/imgs/expression_builder.png)

An expression is a combination of one or more constants, variables, functions, and operators that can be evaluated to produce another value.

To create an expression, you do not necessarily need to use the Expression Builder. Alternatively, you can also just type the expression directly into one of teh input boxes in the procedure. However, this requires you to remember all the name of the inline functions, so often it may be useful to use the Expression Builder. In addition, for very long expressions, the Expression Builder provides a larger input box.

Once you have created your expression, you have three options:
* Clicking 'Insert' will insert the expression into the active input box in the procedure, overwriting anything that is already there.
* Clicking 'Copy' will copy the expression to the clipboard. You can then insert the expression into the procedure using the Ctrl-v keyboard shortcut. 
* Clicking the 'X' in the top right-hand corner (or clicking anywhere outside the dialog box) will close the dialog box. No change will be made to the procedure.

Note that if you click the 'Expressions' button when no input boxes in the procedure are active, then the 'Insert' button will be disabled. 

**Arithmetic Expressions**

Examples of simple expressions are `2 + 2`, which evaluates to `4`, and `1 == 2`, which evaluates to `false`. Expressions can also contain variables. For example, if the variable `x` exists in the current scope, and has a value of `10`, then the expression `x + 2` will evaluate to `12`. 

**Expressions with Functions**

An expression can also contain inline functions, such as `sqrt(9)` which evaluates to `3`. If you can remember the function name, then you can simply type it into the expression builder input box. Alternatively, you can also search for function names in the list of inline functions. Clicking '?' will display help for the inline function. Clicking on the function name will insert the function into the expression builder input box. 

Functions can also be nested inside one another, for example, `round(sqrt(20))` evaluates to `4`. 

Note that all inline functions return a value. 

**Expressions with Spatial Information Queries**

Expressions also supports a number of shortcuts for querying entities in the spatial information model. 

* The `#XX` and `entity#XX` expressions are used to get a list of entities from the model.
* The `entity@name` expression is used to get attributes from entities in the model.
* The `?@name **value` expression is used to filter a list of entities based on attribute values.  
  
  