export function compoundBFS(roots, k, direction) {
	var Q = [];
	var dist = {};
	var visited = {};
	var compoundVisited = {};
	var neighborNodes = [];
	var neighborEdges = [];
	for (let i = 0; i < roots.length; i++) {
		dist[roots[i].id()] = 0;
		visited[roots[i].id()] = true;
		Q.push(roots[i]);
		neighborNodes.push(roots[i]);
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
					neighborNodes.push(allNodesinCompounds[i]);
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
		//chechking neighbors of current node
		for (let i = 0; i < noOfNeighbors; i++) {
			var neighbori = neighbors[i];
			if (neighbori.isNode()) {
				if (visited[neighbori.id()] !== true && depth + 1 <= k) {
					dist[neighbori.id()] = depth + 1;
					visited[neighbori.id()] = true;
					Q.push(neighbori);
					neighborNodes.push(neighbori);
				}
			}
			else if (neighbori.isEdge() && depth < k) {
				neighborEdges.push(neighbori);
			}
		}
	}
	return {
		neighborNodes: neighborNodes,
		neighborEdges: neighborEdges,
		distances: dist
	};
};