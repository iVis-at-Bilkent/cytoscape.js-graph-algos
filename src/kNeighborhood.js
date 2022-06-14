/*
	Implementation of k-Neighborhood algorithm, this algorithm finds the nodes and paths from source node within given limit(k).
	roots: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
export function kNeighborhood(sourceNode, k, direction) {
	var Q = [];
	var visited = {};
	var compoundVisited = {};
	var kneighbors = [];
	let cy = this.cy();
	var compoundBFS = this.compoundBFS(sourceNode, k, direction);
	let neighborNodes = compoundBFS.neighborNodes;
	let neighborEdges = compoundBFS.neighborEdges;
	
	return {
		neighborNodes: neighborNodes,
		neighborEdges: neighborEdges
	};
};