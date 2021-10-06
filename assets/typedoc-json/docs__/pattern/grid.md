## pattern.Grid  
  
  
**Description:** Creates positions in a grid pattern.


The `origin` parameter specifies the centre of the grid for which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated for a grid on the origin XY plane. So if the origin plane is
rotated, then the grid will also be rotated.


The `size` parameter specifies the size of the grid.
- If only one number is given, then width and length are assumed to be equal.
- If a list of two numbers is given, then they will be interpreted as `[width, length]`.


The width dimension will be in the X-direction of the origin plane, and the length will be in
the Y direction of the origin plane.


The `num_positions` parameter specifies the number of columns and rows of positions in the grid.
- If only one number is given, then the grid is assumed to have equal number columns and rows.
- If a list of two numbers is given, then they will be interpreted as `[columns, rows]`.


The `columns` will be parallel to the Y-direction of the origin plane,
and the `rows` will be parallel to the X-direction of the origin plane.


For example, consider the following function call:
`posis = pattern.Grid(XY, [10, 20], [3, 5], 'flat')`
This will generate the following grid:


![An example of pattern.Grid](assets/typedoc-json/docMDimgs/pattern_grid.png)


The positions can either be returned as a flat list or as nested lists.
For the nested lists, three options are available:
- `columns`: Each nested list represents a column of positions.
- `rows`: Each nested list represents a row of positions.
- `quads`: Each nested list represents four positions, forming a quadrilateral. Neighbouring
quadrilaterals share positions.


Below are the varying results when calling the function with the method set to
`flat`, `columns`, `rows` and `quads`:


`posis = pattern.Grid(XY, [10,20], [2,3], 'flat')`
```
posis = ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5"]
```


`posis = pattern.Grid(XY, [10,20], [2,3], 'columns')`
```
posis = [
    ["ps0", "ps2", "ps4"],
    ["ps1", "ps3", "ps5"]
]
```


`posis = pattern.Grid(XY, [10,20], [2,3], 'rows')`
```
posis = [
    ["ps0", "ps1"],
    ["ps2", "ps3"],
    ["ps4", "ps5"]
]
```


`posis = pattern.Grid(XY, [10,20], [2,3], 'quads')`
```
posis = [
    ["ps0", "ps1", "ps3", "ps2"],
    ["ps2", "ps3", "ps5", "ps4"]
]
```


When the method is set to `columns` or `rows`, polylines can be generated as follows:
```
posis = pattern.Grid(XY, [10,20], [2,3], 'rows')
plines = make.Polyline(posis, 'open')
```
When the method is set to quads, polygons can be generated as follows:
```
posis = pattern.Grid(XY, [10,20], [2,3], 'quads')
pgons = make.Polygon(posis)
```

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *size:* The width and length of grid.
If a single number is given, then the width and length are assumed to be equal.
If a list of two numbers is given, then they will be interpreted as `[width, length]`.  
  * *num\_positions:* Number of columns and rows of positions in the grid.
If a single number is given, then the number of columns and rows are assumed to be equal.
If a list of two numbers is given, then they will be interpreted as `[columns, rows]`.  
  * *method:* Enum, define the way the coords will be return as lists.  
  
**Returns:** Entities, a list of positions, or a list of lists of positions
(depending on the 'method' setting).  
**Examples:**  
  * posis = pattern.Grid([0,0,0], 10, 3, 'flat')  
    Creates a list of 9 positions on a 3x3 square grid with a size of 10.  
  * `posis = pattern.Grid([0,0,0], [10,20], [3,4], 'flat')`  
    Creates a list of 12 positions on a 3x4 grid. The grid as a width of 10
and a length of 20. The positions are returned as a flat list.
  
