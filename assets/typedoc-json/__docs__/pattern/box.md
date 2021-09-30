## pattern.Box  
  
  
**Description:** Creates positions in a box pattern. Positions are only generated on the outer surface of the box.
No positions are generated in the interior of the box.


The `origin` parameter specifies the centre of the box for which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated for a box aligned with the origin XY plane.
So if the origin plane is rotated, then the box will also be rotated.


The `size` parameter specifies the size of the box.
- If only one number is given, then the width, length, and height are assumed to be equal.
- If a list of two numbers is given, then they will be interpreted as `[width, length]`,
and the height will be the same as the length.
- If a list of three numbers is given, then they will be interpreted as `[width, length, height]`.


The width dimension will be in the X-direction of the origin plane,
the length in the Y direction, and the height in the Z-direction.


The `num_positions` parameter specifies the number of columns, rows, and layers of positions
in the box.
- If only one number is given, then the box is assumed to have equal number columns, rows,
and layers.
- If a list of two numbers is given, then they will be interpreted as `[columns, rows]`,
and the number of layers will be the same as the rows.
- If a list of three numbers is given, then they will be interpreted as `[columns, rows, layers]`.


The `columns` will be parallel to the Y-direction of the origin plane,
and the `rows` will be parallel to the X-direction of the origin plane.
The layers are stacked up in the Z-direction of the origin plane.


For example, consider the following function call:
`posis = pattern.Box(XY, [10,20,30], [2,3,2], 'flat')`
This will generate the following box:


![An example of pattern.Box](assets/typedoc-json/docMDimgs/pattern_box.png)


Below are the varying results when calling the function with the method set to
`flat`, `columns`, `rows` `layers` and `quads`:


`posis = pattern.Box(XY, [10,20,30], [2,3,2], 'flat')`
```
posis = ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8", "ps9", "ps10", "ps11"]
```


`posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'columns')`
```
posis = [
    ["ps0", "ps1", "ps6", "ps7"],
    ["ps2", "ps3", "ps8", "ps9"],
    ["ps4", "ps5", "ps10", "ps11"]
]
```


`posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'rows')`
```
posis = [
    ["ps0", "ps2", "ps4", "ps6", "ps8", "ps10"],
    ["ps1", "ps3", "ps5", "ps7", "ps9", "ps11"]
]
```


`posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'layers')`
```
posis = [
    ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5"],
    ["ps6", "ps7", "ps8", "ps9", "ps10", "ps11"]
]
```


`posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'quads')`
```
posis = [
    ["ps0", "ps2", "ps3", "ps1"],
    ["ps2", "ps4", "ps5", "ps3"],
    ["ps0", "ps1", "ps7", "ps6"],
    ["ps1", "ps3", "ps9", "ps7"],
    ["ps3", "ps5", "ps11", "ps9"],
    ["ps5", "ps4", "ps10", "ps11"],
    ["ps4", "ps2", "ps8", "ps10"],
    ["ps2", "ps0", "ps6", "ps8"],
    ["ps6", "ps7", "ps9", "ps8"],
    ["ps8", "ps9", "ps11", "ps10"]
]
```


When the method is set to `columns` or `rows`, polylines can be generated as follows:
```
posis = pattern.Box(XY, [10,20,30], [2,3,2], 'rows')
plines = make.Polyline(posis, 'open')
```
When the method is set to quads, polygons on the box surface can be generated as follows:
```
posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'quads')
pgons = make.Polygon(posis)
```

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *size:* The width, length, and height of the box.
If a single number is given, then the width, length, and height are assumed to be equal.
If a list of two numbers is given, then they will be interpreted as `[width, length]`,
and the height is assumed to be equal to the length.
If a list of three numbers is given, then they will be interpreted as `[width, length, height]`.  
  * *num\_positions:* Number of columns, rows, and layers of positions in the box.
If a single number is given, then the number of columns, rows, and layers are assumed to be equal.
If a list of two numbers is given, then they will be interpreted as `[columns, rows]`,
and the number of layers is assumed to be equal to the number of rows.
If a list of three numbers is given, then they will be interpreted as `[columns, rows, layers]`.  
  * *method:* Enum, define the way the coords will be return as lists.  
  
**Returns:** Entities, a list of positions, or a list of lists of positions
(depending on the 'method' setting).  
**Examples:**  
  * `posis = pattern.Box(XY, [10,20,30], [3,4,5], 'quads')`  
    Returns positions in a box pattern. The size of the box is 10 wide (in X direction)
20 long (Y direction), and 30 high (Z direction). The box has 3 columns, 4 rows, and 5 layers.
This results in a total of 12 (i.e. 3 x 4) positions in the top and bottom layers, and 10
positions in the middle two layers. The positions are returned as nested lists, where each
sub-list contains positions for one quadrilateral.
  
