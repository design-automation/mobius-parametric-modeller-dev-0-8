## pattern.Polyhedron  
  
  
**Description:** Creates positions in a polyhedron pattern.


The five regular polyhedrons can be generated:
- Tetrahedron (4 triangular faces)
- Cube (4 square faces)
- Octahedron (8 triangular faces)
- Icosahedron (20 triangular faces)
- Dodecahedron (12 pentagon faces)


The `origin` parameter specifies the centre of the polyhedron for which positions will be
generated. The origin can be specified as either a <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>. If a coordinate
is given, then a plane will be automatically generated, aligned with the global XY plane.


The positions will be generated for a polyhedron aligned with the origin XY plane.
So if the origin plane is rotated, then the polyhedron will also be rotated.


The `radius` parameter specifies the size of the polyhedron.
All positions that are generated are projected onto the surface of a sphere,
with the specified `radius`.


The faces of the regular polyhedron can be further subdivided by specifying the level of
`detail`. (When subdivided, it will no longer be regular polyhedrons.)


For tetrahedrons, octahedrons, and icosahedrons, the `detail` subdivides as follows:
- Detail = 0: No subdivision
- Detail = 1: Each triangle edge is subdivided into two edges.
- Detail = 2: Each triangle edge is subdivided into three edges.
- etc


Cubes and dodecahedrons do not have triangular faces. So in these cases, the first level of
`detail` converts each non-triangular face into triangles by adding a position at the centre of
the face. The `detail` subdivides as follows:
- Detail= 0: No subdivision.
- Detail = 1: Convert non-triangular faces into triangles.
- Detail = 2: Each triangle edge is subdivided into two edges.
- Detail = 3: Each triangle edge is subdivided into three edges.
- etc


The positions can either be returned as a flat list or as nested lists.
The nested lists represent the faces of the polyhedron.
However, note that only the positions are returned.
If you want to have polygon faces, you need to generate polygons from the positions.


For example, calling the function with `detail = 0` and `method = 'flat_tetra'`,
will result in the following positions:
```
posis = ["ps0", "ps1", "ps2", "ps3"]
```
If you change the method to `method = 'face_tetra'`, then you will get the following nested lists.
```
posis = [
    ["ps2", "ps1", "ps0"],
    ["ps0", "ps3", "ps2"],
    ["ps1", "ps3", "ps0"],
    ["ps2", "ps3", "ps1"]
]
```
Notice that the number of positions is the same in both cases
(i.e. in both cases there are 4 positions: 'ps0', 'ps1', 'ps2', 'ps3').
When `face_tetra` is selected selected, the positions are organised into 4 lists,
representing the 4 faces of the tetrahedron.


The nested lists can be passed to the `make.Polygon` function in order to generated polygonal faces.
Here is an example:


```
posis = pattern.Polyhedron(XY, 10, 0, 'face_tetra')
pgons = make.Polygon(posis)
```


![Tetrahedron with triangular faces](assets/typedoc-json/docMDimgs/polyhedron_tetra.png)

  
  
**Parameters:**  
  * *origin:* A <abbr title='A list of three numbers, [x, y, z]'>coordinate</abbr> or a <abbr title='Three lists of three numbers, [origin, x-axis, y-axis]'>plane</abbr>, specifying the origin of the polyhedron.
If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.  
  * *radius:* The radius of the polyhedron.  
  * *detail:* The level of detail for the polyhedron.  
  * *method:* Enum: The Type of polyhedron to generate.  
  
**Returns:** Entities, a list of positions.  
**Examples:**  
  * `posis = pattern.Polyhedron(XY, 20, 0, 'face_tetra')`  
    Creates positions in a regular tetrahedron pattern, with a radius of 20. The
positions are returned as nested lists, where each list contains the positions for one face.
  
