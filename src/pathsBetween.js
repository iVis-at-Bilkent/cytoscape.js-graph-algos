/*
	Implementation of PathsBetween algorithm, this algorithm finds all paths whose length not exceeding given limit
	, starting from source nodes and ends at source nodes.
	roots: source nodes
	k: limit
*/
export function pathsBetween(roots, k) {
	let cy = this.cy();
	var forwardBFS = cy.elements().compoundBFS(roots, k, "DOWNSTREAM");
	let reverseBFS = cy.elements().compoundBFS(roots, k, "UPSTREAM");
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
	for (let i = 0; i < forwardNeighborEdges.length; i++) {
		if (forwardDist[forwardNeighborEdges[i].source().id()] !== undefined &&
			reverseDist[forwardNeighborEdges[i].target().id()] !== undefined &&
			forwardDist[forwardNeighborEdges[i].source().id()] + reverseDist[forwardNeighborEdges[i].target().id()] < k
		) {
			resultEdges.merge(forwardNeighborEdges[i]);
		}
	}
	return {
		resultNodes: resultNodes,
		resultEdges: resultEdges
	};
}