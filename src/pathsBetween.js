/*
	Implementation of PathsBetween algorithm, this algorithm finds all paths whose length not exceeding given limit
	, starting from source nodes and ends at source nodes.
	roots: source nodes
	k: limit
*/
export function pathsBetween(roots, k, direction) {
	let cy = this.cy();
	var forwardBFS = this.compoundBFS(roots, k, direction === "DIRECTED" ? "DOWNSTREAM" : "BOTHSTREAM");
	let reverseBFS = this.compoundBFS(roots, k, direction === "DIRECTED" ? "UPSTREAM" : "BOTHSTREAM");
	var forwardNeighborNodes = forwardBFS.neighborNodes;
	var forwardNeighborEdges = forwardBFS.neighborEdges;
	var forwardDist = forwardBFS.distances;
	var reverseNeighborNodes = reverseBFS.neighborNodes;
	var reversedNeighborEdges = reverseBFS.neighborEdges;
	var reverseDist = reverseBFS.distances;
	var resultNodes = cy.collection(), resultEdges = cy.collection(), visitSources = {};

	for (let i = 0; i < roots.length; i++)
		visitSources[roots[i].id()] = true;

	for (let i = 0; i < forwardNeighborNodes.length; i++) {
		if (forwardDist[forwardNeighborNodes[i].id()] !== undefined && reverseDist[forwardNeighborNodes[i].id()] &&
			forwardDist[forwardNeighborNodes[i].id()] + reverseDist[forwardNeighborNodes[i].id()] <= k) {
			resultNodes.merge(forwardNeighborNodes[i]);
			if (visitSources[forwardNeighborNodes[i].id()] === true)
				continue;
		}
	}
	var edges = cy.edges();
	for (let i = 0; i < edges.length; i++) {
		if (forwardDist[edges[i].source().id()] !== undefined &&
			reverseDist[edges[i].target().id()] !== undefined &&
			forwardDist[edges[i].source().id()] + reverseDist[edges[i].target().id()] < k 
		) {
			resultEdges.merge(edges[i]);
		}
		else if( direction === "UNDIRECTED" && reverseDist[edges[i].source().id()] !== undefined &&
		forwardDist[edges[i].target().id()] !== undefined &&
		reverseDist[edges[i].source().id()] + forwardDist[edges[i].target().id()] < k){
			resultEdges.merge(edges[i]);
		}
	}
	return {
		resultNodes: resultNodes,
		resultEdges: resultEdges
	};
}