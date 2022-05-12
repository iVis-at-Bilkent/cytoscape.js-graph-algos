'use strict';

function kNeighborhood(root, k, direction) {
  var cy = this.cy();
  var compoundBFS = cy.elements().compoundBFS(root, k, direction);
  var neighborNodes = compoundBFS.neighborNodes;
  var neighborEdges = compoundBFS.neighborEdges;

  for (var i = 0; i < neighborNodes.length; i++) {
    if (neighborNodes[i].isParent() === false && neighborNodes[i].id() !== root.id()) neighborNodes[i].addClass('highlighted');else if (neighborNodes[i].id() !== root.id()) neighborNodes[i].addClass('highlightedParent');
  }

  for (var _i = 0; _i < neighborEdges.length; _i++) {
    neighborEdges[_i].addClass('highlighted');
  }

  return {
    neighborNodes: neighborNodes,
    neighborEdges: neighborEdges
  };
}

function compoundBFS(roots, k, direction) {
  var Q = [];
  var dist = {};
  var visited = {};
  var compoundVisited = {};
  var neighborNodes = [];
  var neighborEdges = [];

  for (var i = 0; i < roots.length; i++) {
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
      var noOfNodesinCompound = allNodesinCompounds.length;

      for (var _i = 0; _i < noOfNodesinCompound; _i++) {
        dist[allNodesinCompounds[_i].id()] = depth;
        compoundVisited[allNodesinCompounds[_i].id()] = true;

        if (visited[allNodesinCompounds[_i].id()] !== true) {
          neighborNodes.push(allNodesinCompounds[_i]);
          visited[allNodesinCompounds[_i].id()] = true;
          Q.push(allNodesinCompounds[_i]);
        }
      }
    }

    var neighbors;
    if (direction === "BOTHSTREAM") neighbors = node.neighborhood();else if (direction === "UPSTREAM") neighbors = node.incomers();else if (direction === "DOWNSTREAM") neighbors = node.outgoers();
    var noOfNeighbors = neighbors.length; //chechking neighbors of current node

    for (var _i2 = 0; _i2 < noOfNeighbors; _i2++) {
      var neighbori = neighbors[_i2];

      if (neighbori.isNode()) {
        if (visited[neighbori.id()] !== true && depth + 1 <= k) {
          dist[neighbori.id()] = depth + 1;
          visited[neighbori.id()] = true;
          Q.push(neighbori);
          neighborNodes.push(neighbori);
        }
      } else if (neighbori.isEdge() && depth < k) {
        neighborEdges.push(neighbori);
      }
    }
  }

  return {
    neighborNodes: neighborNodes,
    neighborEdges: neighborEdges,
    distances: dist
  };
}

function reverseDirection(direction) {
  if (direction === "BOTHSTREAM") return direction;
  if (direction === "UPSTREAM") return "DOWNSTREAM";
  if (direction === "DOWNSTREAM") return "UPSTREAM";
}

function commonStream(roots, k, direction) {
  var count = {};
  var candidates = [];
  var commonNodes = [];
  var commonEdges = [];
  var nodesOnPath = [];
  var distancesFrom = {};
  var visitSources = {};

  for (var i = 0; i < roots.length; i++) {
    visitSources[roots[i].id()] = true;
  }

  for (var _i = 0; _i < roots.length; _i++) {
    // find neighbors for each node in source nodes
    var neighborBFS = cy.elements().compoundBFS(roots[_i], k, direction);
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
  }

  while (candidates.length !== 0) {
    var candidate = candidates.pop(); //select common nodes

    if (count[candidate.id()] === roots.length) {
      if (candidate.isNode()) {
        commonNodes.push(candidate);
        if (visitSources[candidate.id()] === true) continue;
        if (candidate.isParent() === true) candidate.addClass('highlightedCommonParent');else candidate.addClass('highlightedCommon');
        visitSources[candidate.id()] = true;
      } else {
        commonEdges.push(candidate);
      }
    }
  }

  var compoundBFS = cy.elements().compoundBFS(commonNodes, k, reverseDirection(direction));
  var allEdges = cy.edges();
  var allNodes = cy.nodes();
  var neighborNodes = compoundBFS.commonNodes;
  var neighborEdges = compoundBFS.commonEdges;
  var distancesTo = compoundBFS.distances; //highlighting graph

  for (var _i2 = 0; _i2 < allNodes.length; _i2++) {
    var nodeId = allNodes[_i2].id();

    if (distancesFrom[nodeId] !== undefined && distancesTo[nodeId] !== undefined && distancesFrom[nodeId] + distancesTo[nodeId] <= k - 1) {
      if (visitSources[nodeId] === true) continue;
      if (allNodes[_i2].isParent() === true) allNodes[_i2].addClass('highlightedParent');else allNodes[_i2].addClass('highlighted');
      nodesOnPath.push(allNodes[_i2]);
      visitSources[nodeId] = true;
    }
  }

  for (var _i3 = 0; _i3 < allEdges.length; _i3++) {
    var sourceId = allEdges[_i3].source().id();

    var targetId = allEdges[_i3].target().id();

    if (visitSources[sourceId] === true && visitSources[targetId] === true) allEdges[_i3].addClass('highlighted');
  }

  return {
    commonNodes: commonNodes,
    nodesOnPath: nodesOnPath,
    edgesOnPath: commonEdges
  };
}

/*
	Implementation of PathsBetween algorithm, this algorithm finds all paths whose length not exceeding given limit
	, starting from source nodes and ends at source nodes.
	roots: source nodes
	k: limit
*/
function pathsBetween(roots, k) {
  var cy = this.cy();
  var forwardBFS = cy.elements().compoundBFS(roots, k, "DOWNSTREAM");
  var reverseBFS = cy.elements().compoundBFS(roots, k, "UPSTREAM");
  var forwardNeighborNodes = forwardBFS.neighborNodes;
  var forwardNeighborEdges = forwardBFS.neighborEdges;
  var forwardDist = forwardBFS.distances;
  var reverseNeighborNodes = reverseBFS.neighborNodes;
  var reversedNeighborEdges = reverseBFS.neighborEdges;
  var reverseDist = reverseBFS.distances;
  var resultNodes = [],
      resultEdges = [],
      visitSources = {};

  for (var i = 0; i < roots.length; i++) {
    visitSources[roots[i].id()] = true;
  }

  for (var _i = 0; _i < forwardNeighborNodes.length; _i++) {
    if (forwardDist[forwardNeighborNodes[_i].id()] !== undefined && reverseDist[forwardNeighborNodes[_i].id()] && forwardDist[forwardNeighborNodes[_i].id()] + reverseDist[forwardNeighborNodes[_i].id()] <= k) {
      resultNodes.push(forwardNeighborNodes[_i]);
      if (visitSources[forwardNeighborNodes[_i].id()] === true) continue;
      if (forwardNeighborNodes[_i].isParent()) forwardNeighborNodes[_i].addClass('highlightedParent');else forwardNeighborNodes[_i].addClass('highlighted');
    }
  }

  for (var _i2 = 0; _i2 < forwardNeighborEdges.length; _i2++) {
    if (forwardDist[forwardNeighborEdges[_i2].source().id()] !== undefined && reverseDist[forwardNeighborEdges[_i2].target().id()] !== undefined && forwardDist[forwardNeighborEdges[_i2].source().id()] + reverseDist[forwardNeighborEdges[_i2].target().id()] < k) {
      forwardNeighborEdges[_i2].addClass('highlighted');

      resultEdges.push(forwardNeighborEdges[_i2]);
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
  var bfsFromSources = cy.elements().compoundBFS(sources, k, mod === "directed" ? "DOWNSTREAM" : "BOTHSTREAM");
  var bfsToTargets = cy.elements().compoundBFS(targets, k, mod === "directed" ? "UPSTREAM" : "BOTHSTREAM");
  var nodesFromSources = bfsFromSources.neighborNodes;
  var edgesFromSources = bfsFromSources.neighborEdges;
  var distancesFromSources = bfsFromSources.distances;
  var nodesToTargets = bfsToTargets.neighborNodes;
  var edgesToTargets = bfsToTargets.neighborEdges;
  var distancesToTargets = bfsToTargets.distances;
  var l = -1;
  var visitSources = {},
      visitTargets = {};
  var nodesOnThePaths = [],
      edgesOnThePaths = [];

  for (var i = 0; i < sources.length; i++) {
    visitSources[sources[i].id()] = true;
  }

  for (var _i = 0; _i < sources.length; _i++) {
    visitTargets[targets[_i].id()] = true;
  }

  for (var _i2 = 0; _i2 < targets.length; _i2++) {
    if (l == -1) l = distancesFromSources[targets[_i2].id()];
    if (distancesFromSources[targets[_i2].id()] < l) l = distancesFromSources[targets[_i2].id()];
  }

  var edges = cy.edges();

  for (var _i3 = 0; _i3 < edges.length; _i3++) {
    var sourceId = edges[_i3].source().id();

    var targetId = edges[_i3].target().id();

    var minDistance = l + d >= k ? k : l + d;

    if (distancesFromSources[sourceId] !== undefined && distancesToTargets[targetId] !== undefined && distancesFromSources[sourceId] + distancesToTargets[targetId] + 1 <= minDistance) {
      edges[_i3].addClass("highlighted");

      edgesOnThePaths.push(edges[_i3]);
    }

    if (mod === "undirected") {
      if (distancesFromSources[targetId] !== undefined && distancesToTargets[sourceId] !== undefined && distancesFromSources[targetId] + distancesToTargets[sourceId] + 1 <= minDistance) {
        edges[_i3].addClass("highlighted");

        edgesOnThePaths.push(edges[_i3]);
      }
    }
  }

  var nodes = cy.nodes();

  for (var _i4 = 0; _i4 < nodes.length; _i4++) {
    var minDistance = l + d >= k ? k : l + d;

    if (distancesFromSources[nodes[_i4].id()] !== undefined && distancesToTargets[nodes[_i4].id()] !== undefined && distancesFromSources[nodes[_i4].id()] + distancesToTargets[nodes[_i4].id()] <= minDistance) {
      if (visitSources[nodes[_i4].id()] === true || visitTargets[nodes[_i4].id()] === true) continue;

      if (nodes[_i4].isParent() === true) {
        nodes[_i4].addClass("highlightedParent");

        nodesOnThePaths.push(nodes[_i4]);
      } else {
        nodes[_i4].addClass("highlighted");

        nodesOnThePaths.push(nodes[_i4]);
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

if (typeof window.cytoscape !== 'undefined') {
  register(window.cytoscape);
}

module.exports = register;
