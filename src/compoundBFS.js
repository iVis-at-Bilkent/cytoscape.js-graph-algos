/*
	Implementation of Compound BFS algorithm, this algorithm finds the nodes from source nodes within given limit. Other four algorithms
	benefits this algorithm.
	roots: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
export function compoundBFS(roots, k, direction) {
	let eles = this;
	let cy = this.cy();
	var Q = [];
	var dist = {};
	var visited = {};
	var compoundVisited = {};
	var inCallingCollection = {};
	var neighborNodes = cy.collection();
	var neighborEdges = cy.collection();


	for( let i = 0; i < eles.length; i++){
		 inCallingCollection[eles[i].id()] = true;
	}

	//add source nodes to queue
	for (let i = 0; i < roots.length; i++) {
		if( inCallingCollection[roots[i].id()] === true){
		dist[roots[i].id()] = 0;
		visited[roots[i].id()] = true;
		Q.push(roots[i]);
		neighborNodes.merge(roots[i]);
		}
	}

	while (Q.length !== 0) {
		var node = Q.shift();
		var depth = dist[node.id()];
		if (compoundVisited[node.id()] !== true) {
			//find all nodes in compound node if current node is in the compound node
			var anchestors = node.parents();
			anchestors = anchestors.union(node);
			var allNodesinCompounds = anchestors.descendants();
			allNodesinCompounds = allNodesinCompounds.union(anchestors);
			let noOfNodesinCompound = allNodesinCompounds.length;
			for (let i = 0; i < noOfNodesinCompound; i++) {
				dist[allNodesinCompounds[i].id()] = depth;
				compoundVisited[allNodesinCompounds[i].id()] = true;
				if (visited[allNodesinCompounds[i].id()] !== true) {
					neighborNodes.merge(allNodesinCompounds[i]);
					visited[allNodesinCompounds[i].id()] = true;
					Q.push(allNodesinCompounds[i]);
				}
			}
		}
		var neighbors;
		if (direction === "BOTHSTREAM")
			neighbors = node.neighborhood();
		else if (direction === "UPSTREAM")
			neighbors = node.incomers();
		else if (direction === "DOWNSTREAM")
			neighbors = node.outgoers();
		var noOfNeighbors = neighbors.length;
		//chechking neighbors of current node and add them to queue if not visited
		for (let i = 0; i < noOfNeighbors; i++) {
			var neighbori = neighbors[i];
			if (neighbori.isNode()) {
				continue;
			}
			else if (neighbori.isEdge() && depth < k && inCallingCollection[neighbori.id()] === true) {
				var targetNode = neighbori.source().id() === node.id() ? neighbori.target() : neighbori.source();
				
				if ( depth + 1 <= k && inCallingCollection[targetNode.id() ] === true) {
					if(visited[targetNode.id()] !== true ){
					dist[targetNode.id()] = depth + 1;
					visited[targetNode.id()] = true;
					Q.push(targetNode);
					neighborNodes.merge(targetNode);
				    }
					neighborEdges.merge(neighbori);
				}
				
			}
		}
	}
	return {
		neighborNodes: neighborNodes,
		neighborEdges: neighborEdges,
		distances: dist
	};
};