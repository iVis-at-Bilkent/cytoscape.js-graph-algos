/*
	Implementation of PathsFromTo algorithm, this algorithm finds all paths starting from source nodes and ends at 
	target nodes and not exceeding given limit
	sources: source nodes
	targets: target nodes
	k: limit
	d: further distance to compute path limit
	mod: direction of algorithm( directed or undirected)
*/
export function pathsFromTo(sources, targets, k, d, mod) {
	let cy = this.cy();
	var eles = this;
	// forward bfs from source nodes 
	var bfsFromSources = this.compoundBFS(sources, k, mod === "DIRECTED" ?
		"DOWNSTREAM" : "BOTHSTREAM");
	// reverse bfs from target nodes
	var bfsToTargets = this.compoundBFS(targets, k, mod === "DIRECTED" ?
		"UPSTREAM" : "BOTHSTREAM");
	var nodesFromSources = bfsFromSources.neighborNodes;
	var edgesFromSources = bfsFromSources.neighborEdges;
	var distancesFromSources = bfsFromSources.distances;
	var nodesToTargets = bfsToTargets.neighborNodes;
	var edgesToTargets = bfsToTargets.neighborEdges;
	var distancesToTargets = bfsToTargets.distances;
	var l = -1;
	var visitSources = {}, visitTargets = {};
	var nodesOnThePaths = cy.collection(), edgesOnThePaths = cy.collection();
	var inCallingCollection = {};
	for( let i = 0; i < eles.length; i++){
		inCallingCollection[eles[i].id()] = true;
    }
	for (let i = 0; i < sources.length; i++)
		visitSources[sources[i].id()] = true;
	for (let i = 0; i < targets.length; i++)
		visitTargets[targets[i].id()] = true;
	for (let i = 0; i < targets.length; i++) {
		if( distancesFromSources[targets[i].id()] === undefined )
		    continue;
		if (l == -1)
			l = distancesFromSources[targets[i].id()];
		if (distancesFromSources[targets[i].id()] < l)
			l = distancesFromSources[targets[i].id()];
	}
	
	// find paths from source nodes to target nodes
	if( l !== -1 ){
	  var edges = cy.edges();
	  for (let i = 0; i < edges.length; i++) { // find edges on the paths
	   	if( inCallingCollection[edges[i].id()] !== true)
		    continue;
		  var sourceId = edges[i].source().id();
		  var targetId = edges[i].target().id();
		  var minDistance = (l + d >= k ? k : l + d);
		  if (distancesFromSources[sourceId] !== undefined && distancesToTargets[targetId] !== undefined &&
			  distancesFromSources[sourceId] + distancesToTargets[targetId] + 1 <= minDistance) {
			  edgesOnThePaths.merge(edges[i]);
		  }
		  else if (mod === "UNDIRECTED") { // if graph is undirected check reverse direction
			  if (distancesFromSources[targetId] !== undefined && distancesToTargets[sourceId] !== undefined &&
				  distancesFromSources[targetId] + distancesToTargets[sourceId] + 1 <= minDistance) {
				  edgesOnThePaths.merge(edges[i]);
			  }
		  }
	  }
	  var nodes = cy.nodes();
	  for (let i = 0; i < nodes.length; i++) { // find nodes on the paths
		  var minDistance = (l + d >= k ? k : l + d);
		  if (distancesFromSources[nodes[i].id()] !== undefined && distancesToTargets[nodes[i].id()] !== undefined &&
			  distancesFromSources[nodes[i].id()] + distancesToTargets[nodes[i].id()] <= minDistance) {
			if (visitSources[nodes[i].id()] === true || visitTargets[nodes[i].id()] === true)
				continue;
			if (nodes[i].isParent() === true) {
				nodesOnThePaths.merge(nodes[i]);
			}
			else {
				nodesOnThePaths.merge(nodes[i]);
			}
		 }
	  }
  }
	return {
		nodesOnThePaths: nodesOnThePaths,
		edgesOnThePaths: edgesOnThePaths
	};
}