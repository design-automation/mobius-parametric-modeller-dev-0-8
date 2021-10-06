## analyze.ClosestPath  
  
  
**Description:** Calculates the shortest path from every position in source, to the closest position in target.


This differs from the 'analyze.ShortestPath()' function. If you specify multiple target positions,
for each cource position,
the 'analyze.ShortestPath()' function will calculate multiple shortest paths,
i.e. the shortest path to all targets.
This function will caculate just one shortest path,
i.e. the shortest path to the closest target.


Paths are calculated through a network of connected edges.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.


Each edge can be assigned a weight.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


By default, all edges are assigned a weight of 1.
Default weights can be overridden by creating a numeric attribute on edges call 'weight'.


Returns a dictionary containing the shortes paths.


If 'distances' is selected, the dictionary will contain one list:
1. 'distances': a list of distances.


If 'counts' is selected, the dictionary will contain four lists:
1. 'posis': a list of positions traversed by the paths,
2. 'posis_count': a list of numbers that count how often each position was traversed.
3. 'edges': a list of edges traversed by the paths,
4. 'edges_count': a list of numbers that count how often each edge was traversed.


If 'paths' is selected, the dictionary will contain two lists of lists:
1. 'posi_paths': a list of lists of positions, one list for each path.
2. 'edge_paths': a list of lists of edges, one list for each path.


If 'all' is selected, the dictionary will contain all lists just described.

  
  
**Parameters:**  
  * *source:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *target:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *result:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A dictionary containing the results.  
