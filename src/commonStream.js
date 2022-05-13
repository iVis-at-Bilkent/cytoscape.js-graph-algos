function reverseDirection(direction) {
	if (direction === "BOTHSTREAM")
		return direction;
	if (direction === "UPSTREAM")
		return "DOWNSTREAM";
	if (direction === "DOWNSTREAM")
		return "UPSTREAM";
}
export function commonStream(roots, k, direction) {
	let cy = this.cy();
	var count = {};
	var candidates = [];
	var commonNodes = [];
	var commonEdges = [];
	var nodesOnPath = [];
	var distancesFrom = {};
	var visitSources = {};
	for (let i = 0; i < roots.length; i++)
		visitSources[roots[i].id()] = true;
	for (let i = 0; i < roots.length; i++) {
		// find neighbors for each node in source nodes
		let neighborBFS = cy.elements().compoundBFS(roots[i], k, direction);
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
	while (candidates.length !== 0) {
		var candidate = candidates.pop();
		//select common nodes
		if (count[candidate.id()] === roots.length) {
			if (candidate.isNode()) {
				commonNodes.push(candidate);
				if (visitSources[candidate.id()] === true)
					continue;
				if (candidate.isParent() === true)
					candidate.addClass('highlightedCommonParent');
				else
					candidate.addClass('highlightedCommon');
				visitSources[candidate.id()] = true;
			}
			else {
				commonEdges.push(candidate);
			}
		}
	}
	var compoundBFS = cy.elements().compoundBFS(commonNodes, k, reverseDirection(direction));
	var allEdges = cy.edges();
	var allNodes = cy.nodes();
	var neighborNodes = compoundBFS.commonNodes;
	var neighborEdges = compoundBFS.commonEdges;
	var distancesTo = compoundBFS.distances;
	//highlighting graph
	for (let i = 0; i < allNodes.length; i++) {
		var nodeId = allNodes[i].id();
		if (distancesFrom[nodeId] !== undefined && distancesTo[nodeId] !== undefined &&
			distancesFrom[nodeId] + distancesTo[nodeId] <= k - 1) {
			if (visitSources[nodeId] === true)
				continue;
			if (allNodes[i].isParent() === true)
				allNodes[i].addClass('highlightedParent');
			else
				allNodes[i].addClass('highlighted');
			nodesOnPath.push(allNodes[i]);
			visitSources[nodeId] = true;
		}
	}
	for (let i = 0; i < allEdges.length; i++) {
		var sourceId = allEdges[i].source().id();
		var targetId = allEdges[i].target().id();
		if (visitSources[sourceId] === true && visitSources[targetId] === true)
			allEdges[i].addClass('highlighted');
	}
	return {
		commonNodes: commonNodes,
		nodesOnPath: nodesOnPath,
		edgesOnPath: commonEdges
	}
}