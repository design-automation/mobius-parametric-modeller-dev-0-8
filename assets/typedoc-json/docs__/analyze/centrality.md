## analyze.Centrality  
  
  
**Description:** Calculates betweenness, closeness, and harmonic centrality
for positions in a network. Values are normalized in the range 0 to 1.


The network is defined by a set of connected edges, consisting of polylines and/or polygons.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


Centralities are calculate based on distances between positions.
The distance between two positions is the shortest path between those positions.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.


Closeness centrality is calculated by inverting the sum of the distances to all other positions.


Harmonic centrality is calculated by summing up the inverted distances to all other positions.


Betweenness centrality os calculated in two steps.
First, the shortest path between every pair of nodes is calculated.
Second, the betweenness centrality of each node is then the total number of times the node is traversed
by the shortest paths.


For closeness centrality, the network is first split up into connected sub-networks.
This is because closeness centrality cannot be calculated on networks that are not fully connected.
The closeness centrality is then calculated for each sub-network seperately.


For harmonic centrality, care must be taken when defining custom weights.
Weight with zero values or very small values will result in errors or will distort the results.
This is due to the inversion operation: 1 / weight.


Returns a dictionary containing the results.


1. 'posis': a list of position IDs.
2. 'centrality': a list of numbers, the values for centrality, either betweenness, closeness, or harmonic.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.
These positions should be part of the network.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *cen\_type:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A list of centrality values, between 0 and 1.  
