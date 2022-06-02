export function kNeighborhood(sourceNodes, k, direction) {
	var Q = [];
	var visited = {};
	var compoundVisited = {};
	var kneighbors = [];
	let cy = this.cy();
	var compoundBFS = this.compoundBFS(sourceNodes, k, direction);
	let neighborNodes = compoundBFS.neighborNodes;
	let neighborEdges = compoundBFS.neighborEdges;
	
	return {
		neighborNodes: neighborNodes,
		neighborEdges: neighborEdges
	};
};