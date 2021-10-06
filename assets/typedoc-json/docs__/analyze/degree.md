## analyze.Degree  
  
  
**Description:** Calculates degree centrality for positions in a network. Values are normalized in the range 0 to 1.


The network is defined by a set of connected edges, consisting of polylines and/or polygons.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


Degree centrality is based on the idea that the centrality of a position in a network is related to
the number of direct links that it has to other positions.


If 'undirected' is selected,  degree centrality is calculated by summing up the weights
of all edges connected to a position.
If 'directed' is selected, then two types of centrality are calculated: incoming degree and
outgoing degree.
Incoming degree is calculated by summing up the weights of all incoming edges connected to a position.
Outgoing degree is calculated by summing up the weights of all outgoing edges connected to a position.


Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.


Returns a dictionary containing the results.


If 'undirected' is selected, the dictionary will contain  the following:
1. 'posis': a list of position IDs.
2. 'degree': a list of numbers, the values for degree centrality.


If 'directed' is selected, the dictionary will contain  the following:
1. 'posis': a list of position IDs.
2. 'indegree': a list of numbers, the values for incoming degree centrality.
3. 'outdegree': a list of numbers, the values for outgoing degree centrality.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.
These positions should be part of the network.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *alpha:* The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
disregards number of edges and solely uses the edge weights in the centrality calculation.  
  * *method:* Enum, the method to use, directed or undirected.  
  
**Returns:** A dictionary containing the results.  
