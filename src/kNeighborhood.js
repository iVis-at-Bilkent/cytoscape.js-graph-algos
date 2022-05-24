export function kNeighborhood(root, k, direction) {
	var Q = [];
	var visited = {};
	var compoundVisited = {};
	var kneighbors = [];
	let cy = this.cy();
	var compoundBFS = cy.elements().compoundBFS(root, k, direction);
	let neighborNodes = compoundBFS.neighborNodes;
	let neighborEdges = compoundBFS.neighborEdges;
	
	return {
		neighborNodes: neighborNodes,
		neighborEdges: neighborEdges
	};
};