## visualize.Gradient  
  
  
**Description:** Generates a colour range based on a numeric attribute.
Sets the color by creating a vertex attribute called 'rgb' and setting the value.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *attrib:* The numeric attribute to be used to create the gradient.
You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.  
  * *range:* The range of the attribute, [minimum, maximum].
If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.  
  * *method:* Enum, the colour gradient to use.  
  
**Returns:** void  
