## edit.Divide  
  
  
**Description:** Divides edges into a set of shorter edges.


- If the `by_number` method is selected, then each edge is divided into
a fixed number of equal length shorter edges.
- If the `by_length` method is selected, then each edge is divided into
shorter edges of the specified length.
- The length of the last segment will be the remainder.
- If the `by_min_length` method is selected,
then the edge is divided into the number of shorter edges
with lengths equal to or greater than the minimum length specified.
- If the `by_max_length` method is selected,
then the edge is divided into the number of shorter edges
with lengths equal to or less than the maximum length specified.

  
  
**Parameters:**  
  * *entities:* Edges, or entities from which edges can be extracted.  
  * *divisor:* Segment length or number of segments.  
  * *method:* Enum, select the method for dividing edges.  
  
**Returns:** Entities, a list of new edges resulting from the divide operation.  
**Examples:**  
  * `segments1 = make.Divide(edge1, 5, by_number)`  
    Creates a list of 5 equal length edges from edge1.  
  * `segments2 = make.Divide(edge1, 5, by_length)`  
    If edge1 has length 13, creates two new edges of length 5 and one new edge of length 3.
  
