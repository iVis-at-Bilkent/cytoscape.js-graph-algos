/*
	Implementation of PathsBetween algorithm, this algorithm finds all paths whose length not exceeding given limit
	, starting from source nodes and ends at source nodes.
	k: limit
*/
export function pathsBetween(sourceNodes, k) {
	let cy = this.cy();
	var eles = this;
	var forwardBFS = this.compoundBFS(sourceNodes, k, "DOWNSTREAM");
	let reverseBFS = this.compoundBFS(sourceNodes, k, "UPSTREAM");
	var forwardNeighborNodes = forwardBFS.neighborNodes;
	var forwardNeighborEdges = forwardBFS.neighborEdges;
	var forwardDist = forwardBFS.distances;
	var reverseNeighborNodes = reverseBFS.neighborNodes;
	var reversedNeighborEdges = reverseBFS.neighborEdges;
	var reverseDist = reverseBFS.distances;
	var resultNodes = cy.collection(), resultEdges = cy.collection(), visitSources = {};
	var inCallingCollection = {};
	for( let i = 0; i < eles.length; i++){
		inCallingCollection[eles[i].id()] = true;
    }

	for (let i = 0; i < sourceNodes.length; i++)
		visitSources[sourceNodes[i].id()] = true;

	for (let i = 0; i < forwardNeighborNodes.length; i++) {
		if (forwardDist[forwardNeighborNodes[i].id()] !== undefined && reverseDist[forwardNeighborNodes[i].id()] &&
			forwardDist[forwardNeighborNodes[i].id()] + reverseDist[forwardNeighborNodes[i].id()] <= k) {
			if (visitSources[forwardNeighborNodes[i].id()] === true)
				continue;
			resultNodes.merge(forwardNeighborNodes[i]);
		}
	}
	var edges = cy.edges();
	for (let i = 0; i < edges.length; i++) {
		if( inCallingCollection[edges[i].id()] !== true)
		    continue;
		if (forwardDist[edges[i].source().id()] !== undefined &&
			reverseDist[edges[i].target().id()] !== undefined &&
			forwardDist[edges[i].source().id()] + reverseDist[edges[i].target().id()] < k 
		) {
			resultEdges.merge(edges[i]);
		}
	}
	return {
		resultNodes: resultNodes,
		resultEdges: resultEdges
	};
}