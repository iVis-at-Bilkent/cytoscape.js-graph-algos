'use strict';

/*
	Implementation of k-Neighborhood algorithm, this algorithm finds the nodes and paths from source node within given limit(k).
	roots: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
function kNeighborhood(sourceNode, k, direction) {
  var cy = this.cy();
  var compoundBFS = this.compoundBFS(sourceNode, k, direction);
  var neighborNodes = compoundBFS.neighborNodes;
  var neighborEdges = compoundBFS.neighborEdges;
  return {
    neighborNodes: neighborNodes,
    neighborEdges: neighborEdges
  };
}

/*
	Implementation of Compound BFS algorithm, this algorithm finds the nodes from source nodes within given limit. Other four algorithms
	benefits this algorithm.
	roots: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
function compoundBFS(roots, k, direction) {
  var eles = this;
  var cy = this.cy();
  var Q = [];
  var dist = {};
  var visited = {};
  var compoundVisited = {};
  var inCallingCollection = {};
  var neighborNodes = cy.collection();
  var neighborEdges = cy.collection();

  for (var i = 0; i < eles.length; i++) {
    inCallingCollection[eles[i].id()] = true;
  } //add source nodes to queue


  for (var _i = 0; _i < roots.length; _i++) {
    if (inCallingCollection[roots[_i].id()] === true) {
      dist[roots[_i].id()] = 0;
      visited[roots[_i].id()] = true;
      Q.push(roots[_i]);
      neighborNodes.merge(roots[_i]);
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
      var noOfNodesinCompound = allNodesinCompounds.length;

      for (var _i2 = 0; _i2 < noOfNodesinCompound; _i2++) {
        dist[allNodesinCompounds[_i2].id()] = depth;
        compoundVisited[allNodesinCompounds[_i2].id()] = true;

        if (visited[allNodesinCompounds[_i2].id()] !== true) {
          neighborNodes.merge(allNodesinCompounds[_i2]);
          visited[allNodesinCompounds[_i2].id()] = true;
          Q.push(allNodesinCompounds[_i2]);
        }
      }
    }

    var neighbors;
    if (direction === "BOTHSTREAM") neighbors = node.neighborhood();else if (direction === "UPSTREAM") neighbors = node.incomers();else if (direction === "DOWNSTREAM") neighbors = node.outgoers();
    var noOfNeighbors = neighbors.length; //chechking neighbors of current node and add them to queue if not visited

    for (var _i3 = 0; _i3 < noOfNeighbors; _i3++) {
      var neighbori = neighbors[_i3];

      if (neighbori.isNode()) {
        continue;
      } else if (neighbori.isEdge() && depth < k && inCallingCollection[neighbori.id()] === true) {
        var targetNode = neighbori.source().id() === node.id() ? neighbori.target() : neighbori.source();

        if (depth + 1 <= k && inCallingCollection[targetNode.id()] === true) {
          if (visited[targetNode.id()] !== true) {
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
}

/*
	Implementation of Common Stream algorithm, this algorithm finds all common nodes which are reachable
	all source nodes within given limit.
	sources: source nodes
	k: limit
	direction: direction of algorithm ( DOWNSTREAM( only outgoing edges), UPSTREAM( only incoming edges), BOTHSTREAM( all edges) )
*/
function reverseDirection(direction) {
  if (direction === "BOTHSTREAM") return direction;
  if (direction === "UPSTREAM") return "DOWNSTREAM";
  if (direction === "DOWNSTREAM") return "UPSTREAM";
}

function commonStream(sourceNodes, k, direction) {
  var cy = this.cy();
  var eles = this;
  var count = {};
  var candidates = [];
  var commonNodes = cy.collection();
  var nodesOnPath = cy.collection();
  var edgesOnPath = cy.collection();
  var distancesFrom = {};
  var visitSources = {};
  var inCallingCollection = {};

  for (var i = 0; i < sourceNodes.length; i++) {
    visitSources[sourceNodes[i].id()] = true;
  }

  for (var _i = 0; _i < eles.length; _i++) {
    inCallingCollection[eles[_i].id()] = true;
  }

  for (var _i2 = 0; _i2 < sourceNodes.length; _i2++) {
    // find neighbors for each node in source nodes
    var neighborBFS = this.compoundBFS(sourceNodes[_i2], k, direction);
    var neighborNodes = neighborBFS.neighborNodes;
    var neighborEdges = neighborBFS.neighborEdges;
    var dist = neighborBFS.distances;

    for (var j = 0; j < neighborNodes.length; j++) {
      if (count[neighborNodes[j].id()] === undefined) {
        count[neighborNodes[j].id()] = 1;
        distancesFrom[neighborNodes[j].id()] = dist[neighborNodes[j].id()];
        candidates.push(neighborNodes[j]);
      } else {
        count[neighborNodes[j].id()]++;
        if (distancesFrom[neighborNodes[j].id()] > dist[neighborNodes[j].id()]) distancesFrom[neighborNodes[j].id()] = dist[neighborNodes[j].id()];
      }
    }

    for (var _j = 0; _j < neighborEdges.length; _j++) {
      if (count[neighborEdges[_j].id()] === undefined) {
        count[neighborEdges[_j].id()] = 1;
      } else count[neighborEdges[_j].id()]++;
    }
  } //find common nodes


  while (candidates.length !== 0) {
    var candidate = candidates.pop();

    if (count[candidate.id()] === sourceNodes.length) {
      if (candidate.isNode()) {
        commonNodes.merge(candidate);
        if (visitSources[candidate.id()] === true) continue;
        visitSources[candidate.id()] = true;
      }
    }
  } //find paths from source nodes to common nodes and highlight


  var compoundBFS = this.compoundBFS(commonNodes, k, reverseDirection(direction));
  var allEdges = cy.edges();
  var allNodes = cy.nodes();
  var neighborNodes = compoundBFS.commonNodes;
  var neighborEdges = compoundBFS.commonEdges;
  var distancesTo = compoundBFS.distances;

  for (var _i3 = 0; _i3 < allNodes.length; _i3++) {
    // find nodes
    var nodeId = allNodes[_i3].id();

    if (distancesFrom[nodeId] !== undefined && distancesTo[nodeId] !== undefined && distancesFrom[nodeId] + distancesTo[nodeId] <= k) {
      if (visitSources[nodeId] === true) continue;
      nodesOnPath.merge(allNodes[_i3]);
      visitSources[nodeId] = true;
    }
  }

  for (var _i4 = 0; _i4 < allEdges.length; _i4++) {
    // find edges
    var sourceId = allEdges[_i4].source().id();

    var targetId = allEdges[_i4].target().id();

    if (inCallingCollection[allEdges[_i4].id()] !== true) continue;

    if (visitSources[sourceId] === true && visitSources[targetId] === true) {
      edgesOnPath.merge(allEdges[_i4]);
    }
  }

  return {
    commonNodes: commonNodes,
    nodesOnPath: nodesOnPath,
    edgesOnPath: edgesOnPath
  };
}

/*
	Implementation of PathsBetween algorithm, this algorithm finds all paths whose length not exceeding given limit
	, starting from source nodes and ends at source nodes.
	k: limit
*/
function pathsBetween(sourceNodes, k, direction) {
  var cy = this.cy();
  var eles = this; // forward( downstream) and reverse( upstream) compound BFSs for calculating distances from source nodes

  var forwardBFS = this.compoundBFS(sourceNodes, k, direction === "DIRECTED" ? "DOWNSTREAM" : "BOTHSTREAM");
  var reverseBFS = this.compoundBFS(sourceNodes, k, direction === "DIRECTED" ? "UPSTREAM" : "BOTHSTREAM");
  var forwardNeighborNodes = forwardBFS.neighborNodes;
  var forwardNeighborEdges = forwardBFS.neighborEdges;
  var forwardDist = forwardBFS.distances;
  var reverseNeighborNodes = reverseBFS.neighborNodes;
  var reversedNeighborEdges = reverseBFS.neighborEdges;
  var reverseDist = reverseBFS.distances;
  var resultNodes = cy.collection(),
      resultEdges = cy.collection(),
      visitSources = {};
  var inCallingCollection = {};

  for (var i = 0; i < eles.length; i++) {
    inCallingCollection[eles[i].id()] = true;
  }

  for (var _i = 0; _i < sourceNodes.length; _i++) {
    visitSources[sourceNodes[_i].id()] = true;
  }

  for (var _i2 = 0; _i2 < forwardNeighborNodes.length; _i2++) {
    // check given node is on any path between source nodes
    if (forwardDist[forwardNeighborNodes[_i2].id()] !== undefined && reverseDist[forwardNeighborNodes[_i2].id()] && forwardDist[forwardNeighborNodes[_i2].id()] + reverseDist[forwardNeighborNodes[_i2].id()] <= k) {
      if (visitSources[forwardNeighborNodes[_i2].id()] === true) continue;
      resultNodes.merge(forwardNeighborNodes[_i2]);
    }
  }

  var edges = cy.edges();

  for (var _i3 = 0; _i3 < edges.length; _i3++) {
    if (inCallingCollection[edges[_i3].id()] !== true) continue; // check given edge is on any path between source nodes

    if (forwardDist[edges[_i3].source().id()] !== undefined && reverseDist[edges[_i3].target().id()] !== undefined && forwardDist[edges[_i3].source().id()] + reverseDist[edges[_i3].target().id()] < k) {
      resultEdges.merge(edges[_i3]);
    } else if (direction === "UNDIRECTED" && reverseDist[edges[_i3].source().id()] !== undefined && forwardDist[edges[_i3].target().id()] !== undefined && reverseDist[edges[_i3].source().id()] + forwardDist[edges[_i3].target().id()] < k) {
      resultEdges.merge(edges[_i3]);
    }
  }

  return {
    resultNodes: resultNodes,
    resultEdges: resultEdges
  };
}

/*
	Implementation of PathsFromTo algorithm, this algorithm finds all paths starting from source nodes and ends at 
	target nodes and not exceeding given limit
	sources: source nodes
	targets: target nodes
	k: limit
	d: further distance to compute path limit
	mod: direction of algorithm( directed or undirected)
*/
function pathsFromTo(sources, targets, k, d, mod) {
  var cy = this.cy();
  var eles = this; // forward bfs from source nodes 

  var bfsFromSources = this.compoundBFS(sources, k, mod === "DIRECTED" ? "DOWNSTREAM" : "BOTHSTREAM"); // reverse bfs from target nodes

  var bfsToTargets = this.compoundBFS(targets, k, mod === "DIRECTED" ? "UPSTREAM" : "BOTHSTREAM");
  var nodesFromSources = bfsFromSources.neighborNodes;
  var edgesFromSources = bfsFromSources.neighborEdges;
  var distancesFromSources = bfsFromSources.distances;
  var nodesToTargets = bfsToTargets.neighborNodes;
  var edgesToTargets = bfsToTargets.neighborEdges;
  var distancesToTargets = bfsToTargets.distances;
  var l = -1;
  var visitSources = {},
      visitTargets = {};
  var nodesOnThePaths = cy.collection(),
      edgesOnThePaths = cy.collection();
  var inCallingCollection = {};

  for (var i = 0; i < eles.length; i++) {
    inCallingCollection[eles[i].id()] = true;
  }

  for (var _i = 0; _i < sources.length; _i++) {
    visitSources[sources[_i].id()] = true;
  }

  for (var _i2 = 0; _i2 < sources.length; _i2++) {
    visitTargets[targets[_i2].id()] = true;
  }

  for (var _i3 = 0; _i3 < targets.length; _i3++) {
    if (distancesFromSources[targets[_i3].id()] === undefined) continue;
    if (l == -1) l = distancesFromSources[targets[_i3].id()];
    if (distancesFromSources[targets[_i3].id()] < l) l = distancesFromSources[targets[_i3].id()];
  } // find paths from source nodes to target nodes


  if (l !== -1) {
    var edges = cy.edges();

    for (var _i4 = 0; _i4 < edges.length; _i4++) {
      // find edges on the paths
      if (inCallingCollection[edges[_i4].id()] !== true) continue;

      var sourceId = edges[_i4].source().id();

      var targetId = edges[_i4].target().id();

      var minDistance = l + d >= k ? k : l + d;

      if (distancesFromSources[sourceId] !== undefined && distancesToTargets[targetId] !== undefined && distancesFromSources[sourceId] + distancesToTargets[targetId] + 1 <= minDistance) {
        edgesOnThePaths.merge(edges[_i4]);
      } else if (mod === "UNDIRECTED") {
        // if graph is undirected check reverse direction
        if (distancesFromSources[targetId] !== undefined && distancesToTargets[sourceId] !== undefined && distancesFromSources[targetId] + distancesToTargets[sourceId] + 1 <= minDistance) {
          edgesOnThePaths.merge(edges[_i4]);
        }
      }
    }

    var nodes = cy.nodes();

    for (var _i5 = 0; _i5 < nodes.length; _i5++) {
      // find nodes on the paths
      var minDistance = l + d >= k ? k : l + d;

      if (distancesFromSources[nodes[_i5].id()] !== undefined && distancesToTargets[nodes[_i5].id()] !== undefined && distancesFromSources[nodes[_i5].id()] + distancesToTargets[nodes[_i5].id()] <= minDistance) {
        if (visitSources[nodes[_i5].id()] === true || visitTargets[nodes[_i5].id()] === true) continue;

        if (nodes[_i5].isParent() === true) {
          nodesOnThePaths.merge(nodes[_i5]);
        } else {
          nodesOnThePaths.merge(nodes[_i5]);
        }
      }
    }
  }

  return {
    nodesOnThePaths: nodesOnThePaths,
    edgesOnThePaths: edgesOnThePaths
  };
}

function register(cytoscape) {
  cytoscape('collection', 'kNeighborhood', kNeighborhood);
  cytoscape('collection', 'compoundBFS', compoundBFS);
  cytoscape('collection', 'commonStream', commonStream);
  cytoscape('collection', 'pathsBetween', pathsBetween);
  cytoscape('collection', 'pathsFromTo', pathsFromTo);
}

if (typeof cytoscape !== 'undefined') {
  register(cytoscape);
}

module.exports = register;
