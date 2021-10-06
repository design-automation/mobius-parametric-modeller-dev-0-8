## pattern.Linear  
  
  
**Description:** Creates a set of positions by linear interpolation between the specified coordinates.


The `num_positions` parameter specifies the number of positions to be generated between
each pair of coordinates.


The `method` parameter specifies whether to close the loop of coordinates. If set to `close`,
then positions are also generated between the last and first coordinates in the list.


For the `num_positions` parameters:
- `num_positions = 0`: No positions are generated.
- `num_positions = 1`: No new coordinates are calculated.
If `close` is true, then positions are generate at all coordinates in the input list.
If `close` is false, then positions are generate at all coordinates in the input list
except the last coordinate (which is ignored).
- `num_positions = 2`: No new coordinates are calculated. Positions are generate at all
coordinates in the input list. (The `close` parameter has no effect.)
- `num_positions = 3`: For each pair of coordinates, one additional coordinate
is calculated by linear interpolation.
- `num_positions = 4`: For each pair of coordinates, two additional coordinates
are calculated by linear interpolation.
- etc


For example, lets consider a case where you specify three coordinates, set the method to `close`
and set `num_positions` to 4. In this case, there will be 3 pairs of coordinates, `[0, 1]`,
`[1, 2]` and `[2, 0]`. For each pair of coordinates, 2 new calculations are calculated.
This results in a total of 9 coordinates. So 9 positions will be generated.


Returns the list of new position IDs.

  
  
**Parameters:**  
  * *coords:* A list of coordinates.  
  * *close:* Enum, 'open' or 'close'.  
  * *num\_positions:* undefined  
  
**Returns:** Entities, a list of new position IDs.  
**Examples:**  
  * posis = pattern.Linear([[0,0,0], [10,0,0]], false, 3)  
    Generates 3 positions, located at [0,0,0], [5,0,0], and [10,0,0].  
  * `posis = pattern.Linear([[0,0,0], [10,0,0], [10,10,0]], 'close', 4)`  
    Generates 9 positions. Two new coordinates are calculated between each pair of
input positions.
  
