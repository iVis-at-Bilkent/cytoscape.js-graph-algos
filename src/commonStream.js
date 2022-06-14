/*
	Implementation of Common Stream algorithm, this algorithm finds all common nodes which are reachable
	all source nodes within given limit.
	sources: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
function reverseDirection(direction) {
	if (direction === "BOTHSTREAM")
		return direction;
	if (direction === "UPSTREAM")
		return "DOWNSTREAM";
	if (direction === "DOWNSTREAM")
		return "UPSTREAM";
}
export function commonStream(sourceNodes, k, direction) {
	let cy = this.cy();
	var eles = this;
	var count = {};
	var candidates = [];
	var commonNodes = cy.collection();
	var commonEdges = [];
	var nodesOnPath = cy.collection();
	var edgesOnPath = cy.collection();
	var distancesFrom = {};
	var visitSources = {};
	var inCallingCollection = {};
	for (let i = 0; i < sourceNodes.length; i++)
		visitSources[sourceNodes[i].id()] = true;
	for( let i = 0; i < eles.length; i++){
		inCallingCollection[eles[i].id()] = true;
    }
	for (let i = 0; i < sourceNodes.length; i++) {
		// find neighbors for each node in source nodes
		let neighborBFS = this.compoundBFS(sourceNodes[i], k, direction);
		var neighborNodes = neighborBFS.neighborNodes;
		var neighborEdges = neighborBFS.neighborEdges;
		var dist = neighborBFS.distances;
		for (let j = 0; j < neighborNodes.length; j++) {
			if (count[neighborNodes[j].id()] === undefined) {
				count[neighborNodes[j].id()] = 1;
				distancesFrom[neighborNodes[j].id()] = dist[neighborNodes[j].id()];
				candidates.push(neighborNodes[j]);
			}
			else {
				count[neighborNodes[j].id()]++;
				if (distancesFrom[neighborNodes[j].id()] > dist[neighborNodes[j].id()])
					distancesFrom[neighborNodes[j].id()] = dist[neighborNodes[j].id()];
			}
		}
		for (let j = 0; j < neighborEdges.length; j++)
			if (count[neighborEdges[j].id()] === undefined) {
				count[neighborEdges[j].id()] = 1;
			}
			else
				count[neighborEdges[j].id()]++;
	}
	//find common nodes
	while (candidates.length !== 0) {
		var candidate = candidates.pop();
		if (count[candidate.id()] === sourceNodes.length) {
			if (candidate.isNode()) {
				commonNodes.merge(candidate);
				if (visitSources[candidate.id()] === true)
					continue;
				visitSources[candidate.id()] = true;
			}
			else {
				commonEdges.push(candidate);
			}
		}
	}

	//find paths from source nodes to common nodes and highlight
	var compoundBFS = this.compoundBFS(commonNodes, k, reverseDirection(direction));
	var allEdges = cy.edges();
	var allNodes = cy.nodes();
	var neighborNodes = compoundBFS.commonNodes;
	var neighborEdges = compoundBFS.commonEdges;
	var distancesTo = compoundBFS.distances;
	for (let i = 0; i < allNodes.length; i++) { // find nodes
		var nodeId = allNodes[i].id();
		if (distancesFrom[nodeId] !== undefined && distancesTo[nodeId] !== undefined &&
			distancesFrom[nodeId] + distancesTo[nodeId] <= k ) {
			if (visitSources[nodeId] === true)
				continue;
			nodesOnPath.merge(allNodes[i]);
			visitSources[nodeId] = true;
		}
	}
	for (let i = 0; i < allEdges.length; i++) { // find edges
		var sourceId = allEdges[i].source().id();
		var targetId = allEdges[i].target().id();
		if( inCallingCollection[allEdges[i].id()] !== true )
		    continue;
		if (visitSources[sourceId] === true && visitSources[targetId] === true){
			edgesOnPath.merge(allEdges[i]);
		}
	}
	return {
		commonNodes: commonNodes,
		nodesOnPath: nodesOnPath,
		edgesOnPath: edgesOnPath
	}
}