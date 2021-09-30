## edit.Fuse  
  
  
**Description:** Fuse positions that lie within a certain tolerance of one another.
New positions will be created.


The existing positions are analysed and clustered into groups of positions that lie with the
tolerance distance from one another. For each cluster, a new position is created at the centre
of the cluster. The xyz coordinates of the new position will be calculated as the average of all
the existing positions in the cluster.


If the positions that are fuse have vertices attached, then the vertices will become welded.
(Note that when using the `edit.Weld()` function, there is no threshold tolerance. Even vertices
that are far apart can be welded together. Fusing allows only vertices that are close together
to be welded.)


In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
The deletion of edges may also result in polylines or polygons being deleted. (It is therefore
advisable to filter out deleted entities after applying the `edit.Fuse()` function. For example,
if you have a list of polygons, after fusing, you can filter the list like this:
`pgons = pgons#pg`.)


The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of positions, or entities from which positions can be extracted.  
  * *tolerance:* The distance tolerance for fusing positions.  
  
**Returns:** void  
