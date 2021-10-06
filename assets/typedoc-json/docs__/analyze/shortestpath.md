## analyze.ShortestPath  
  
  
**Description:** Calculates the shortest path from every source position to every target position.


Paths are calculated through a network of connected edges.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.


Each edge can be assigned a weight.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


By default, all edges are assigned a weight of 1.
Default weights can be overridden by creating a numeric attribute on edges call 'weight'.


Returns a dictionary containing the shortest paths.


If 'distances' is selected, the dictionary will contain two list:
1. 'source_posis': a list of start positions for eah path,
2. 'distances': a list of distances, one list for each path starting at each source position.


If 'counts' is selected, the dictionary will contain four lists:
1. 'posis': a list of positions traversed by the paths,
2. 'posis_count': a list of numbers that count how often each position was traversed,
3. 'edges': a list of edges traversed by the paths,
4. 'edges_count': a list of numbers that count how often each edge was traversed.


If 'paths' is selected, the dictionary will contain two lists of lists:
1. 'posi_paths': a list of lists of positions, one list for each path,
2. 'edge_paths': a list of lists of edges, one list for each path.


If 'all' is selected, the dictionary will contain all lists just described.

  
  
**Parameters:**  
  * *source:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *target:* Path target, a list of positions, or entities from which positions can be extracted.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *result:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A dictionary containing the results.  
