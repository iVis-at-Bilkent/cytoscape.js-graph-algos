(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.cytoscape = global.cytoscape || {}, global.cytoscape['js-graph-algos'] = factory()));
}(this, function () { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function kneighborhood(root, k, direction) {
    //export burda yapılcak
    var Q = []; //var dist = {};

    var visited = {};
    var compoundVisited = {};
    //visited[root.id()] = true;

    var _cy$elements$compound = cy.elements().compoundbfs(root, k, direction),
        _cy$elements$compound2 = _slicedToArray(_cy$elements$compound, 3),
        neighbornodes = _cy$elements$compound2[0],
        neighboredges = _cy$elements$compound2[1],
        dist = _cy$elements$compound2[2];

    console.log(neighbornodes.length, neighboredges.length); //console.log(dist[neighbornodes[0].id()]);

    for (var i = 0; i < neighbornodes.length; i++) {
      if (neighbornodes[i].isParent() === false) neighbornodes[i].addClass('highlighted');else neighbornodes[i].addClass('highlightedParent');
      console.log(neighbornodes[i].id()); //neighbornodes[i].select();
    }

    for (var _i = 0; _i < neighboredges.length; _i++) {
      neighboredges[_i].addClass('highlighted'); //neighboredges[i].select();

    }

    return [neighbornodes, neighboredges]; //  var cyy = cytoscape({container: document.getElementById('cyy')});

    Q.push(root); //kneighbors.push(root);
    // root = cy.$('f68');
    //  console.log(root);

    /*console.log(root.isNode());
    console.log(root.connectedEdges()) ;
    console.log(nodes.length);*/

    while (Q.length !== 0) {
      var node = Q.shift();
      var depth = dist[node.id()];
      console.log(node.id() + " " + dist[node.id()]);

      if (compoundVisited[node.id()] !== true) {
        var anchestors = node.parents();
        anchestors = anchestors.union(node);
        var allNodesinCompounds = anchestors.descendants();
        allNodesinCompounds = allNodesinCompounds.union(anchestors);
        var noOfNodesinCompound = allNodesinCompounds.length; //console.log(anchestors.length);

        for (var _i2 = 0; _i2 < noOfNodesinCompound; _i2++) {
          dist[allNodesinCompounds[_i2].id()] = depth;
          compoundVisited[allNodesinCompounds[_i2].id()] = true;

          if (visited[allNodesinCompounds[_i2].id()] !== true) {
            visited[allNodesinCompounds[_i2].id()] = true;
            Q.push(allNodesinCompounds[_i2]);
          }
        }
      }

      var neighbors = node.neighborhood();
      var noOfNeighbors = neighbors.length; //console.log(noOfNeighbors);

      for (var _i3 = 0; _i3 < noOfNeighbors; _i3++) {
        var neighbori = neighbors[_i3];

        if (neighbori.isNode()) {
          if (visited[neighbori.id()] !== true && depth + 1 <= k) {
            dist[neighbori.id()] = depth + 1; //console.log(neighbori.id());

            visited[neighbori.id()] = true;
            Q.push(neighbori);
            neighbori.select(); //       for( let j = 0; j < neighbori.incomers().length; j++)
            //     console.log(neighbori.incomers()[j].id());
            //   console.log("end");
          } //console.log("end");

        }
      }
    }
    /*cy.layout({
      name: 'null'
    }).run();**/
    //return cyy ; 

  }

  function compoundbfs(roots, k, direction) {
    //export burda yapılcak
    var Q = [];
    var dist = {};
    var visited = {};
    var compoundVisited = {};
    var neighbornodes = [];
    var neighboredges = [];

    for (var i = 0; i < roots.length; i++) {
      dist[roots[i].id()] = 0;
      visited[roots[i].id()] = true;
      Q.push(roots[i]);
      neighbornodes.push(roots[i]);
    } //  var cyy = cytoscape({container: document.getElementById('cyy')});
    //kneighbors.push(root);
    // root = cy.$('f68');
    //  console.log(root);

    /*console.log(root.isNode());
    console.log(root.connectedEdges()) ;
    console.log(nodes.length);*/


    while (Q.length !== 0) {
      var node = Q.shift();
      var depth = dist[node.id()];
      console.log(node.id() + " " + dist[node.id()]);

      if (compoundVisited[node.id()] !== true) {
        var anchestors = node.parents();
        anchestors = anchestors.union(node);
        var allNodesinCompounds = anchestors.descendants();
        allNodesinCompounds = allNodesinCompounds.union(anchestors);
        var noOfNodesinCompound = allNodesinCompounds.length;
        console.log(node.id() + " " + noOfNodesinCompound);

        for (var _i = 0; _i < noOfNodesinCompound; _i++) {
          dist[allNodesinCompounds[_i].id()] = depth;
          compoundVisited[allNodesinCompounds[_i].id()] = true;

          if (visited[allNodesinCompounds[_i].id()] !== true) {
            neighbornodes.push(allNodesinCompounds[_i]);
            visited[allNodesinCompounds[_i].id()] = true;
            Q.push(allNodesinCompounds[_i]);
          }
        }
      }

      var neighbors;
      if (direction === "BOTHSTREAM") neighbors = node.neighborhood();else if (direction === "UPSTREAM") neighbors = node.incomers();else if (direction === "DOWNSTREAM") neighbors = node.outgoers();
      var noOfNeighbors = neighbors.length; //console.log(noOfNeighbors);

      for (var _i2 = 0; _i2 < noOfNeighbors; _i2++) {
        var neighbori = neighbors[_i2];

        if (neighbori.isNode()) {
          if (visited[neighbori.id()] !== true && depth + 1 <= k) {
            dist[neighbori.id()] = depth + 1; //console.log(neighbori.id());

            visited[neighbori.id()] = true;
            Q.push(neighbori); //neighbori.select();

            neighbornodes.push(neighbori); //       for( let j = 0; j < neighbori.incomers().length; j++)
            //     console.log(neighbori.incomers()[j].id());
            //   console.log("end");
          } //console.log("end");

        } else if (neighbori.isEdge() && depth < k) {
          neighboredges.push(neighbori);
        }
      }
    }

    for (var _i3 = 0; _i3 < neighboredges.length; _i3++) {
      console.log("Edge" + " " + neighboredges[_i3].id());
    }

    return [neighbornodes, neighboredges, dist];
    /*cy.layout({
      name: 'null'
    }).run();**/
    //return cyy ; 
  }

  function reverseDirection(direction) {
    if (direction === "BOTHSTREAM") return direction;
    if (direction === "UPSTREAM") return "DOWNSTREAM";
    if (direction === "DOWNSTREAM") return "UPSTREAM";
  }

  function commonstream(roots, k, direction) {
    var count = {};
    var candidates = [];
    var commonnodes = [];
    var commonedges = [];
    var distancesFrom = {};

    for (var i = 0; i < roots.length; i++) {
      var _cy$elements$compound = cy.elements().compoundbfs(roots[i], k, direction),
          _cy$elements$compound2 = _slicedToArray(_cy$elements$compound, 3),
          _neighbornodes = _cy$elements$compound2[0],
          _neighboredges = _cy$elements$compound2[1],
          dist = _cy$elements$compound2[2];

      for (var j = 0; j < _neighboredges.length; j++) {
        console.log(i + " " + _neighboredges[j].id() + " Edges");
      }

      console.log(dist[_neighbornodes[0].id()] + " " + i);

      for (var _j = 0; _j < _neighbornodes.length; _j++) {
        if (_neighbornodes[_j].id() === "glyph27") console.log("Distance" + dist[_neighbornodes[_j].id()]);
        console.log(_neighbornodes[_j].id() + " " + i + " " + dist[_neighbornodes[_j].id()]);

        if (count[_neighbornodes[_j].id()] === undefined) {
          count[_neighbornodes[_j].id()] = 1;
          distancesFrom[_neighbornodes[_j].id()] = dist[_neighbornodes[_j].id()];
          candidates.push(_neighbornodes[_j]);
        } else {
          count[_neighbornodes[_j].id()]++;
          if (distancesFrom[_neighbornodes[_j].id()] > dist[_neighbornodes[_j].id()]) distancesFrom[_neighbornodes[_j].id()] = dist[_neighbornodes[_j].id()];
        }
      }

      for (var _j2 = 0; _j2 < _neighboredges.length; _j2++) {
        if (count[_neighboredges[_j2].id()] === undefined) {
          count[_neighboredges[_j2].id()] = 1; //  candidates.push( neighboredges[j] );
        } else count[_neighboredges[_j2].id()]++;
      }
    }

    while (candidates.length !== 0) {
      var candidate = candidates.pop();

      if (count[candidate.id()] === roots.length) {
        if (candidate.isNode()) {
          console.log(candidate.id());
          commonnodes.push(candidate);
          if (candidate.isParent() === true) candidate.addClass('highlightedParent');else candidate.addClass('highlighted');
        } else {
          commonedges.push(candidate); //candidate.addClass('highlighted');
        } //candidate.select();

      }
    }

    var _cy$elements$compound3 = cy.elements().compoundbfs(commonnodes, k, reverseDirection(direction)),
        _cy$elements$compound4 = _slicedToArray(_cy$elements$compound3, 3),
        neighbornodes = _cy$elements$compound4[0],
        neighboredges = _cy$elements$compound4[1],
        distancesTo = _cy$elements$compound4[2];

    var allEdges = cy.edges();

    for (var _i = 0; _i < allEdges.length; _i++) {
      var sourceId = allEdges[_i].source().id();

      var targetId = allEdges[_i].target().id();

      if (direction === "BOTHSTREAM") {
        if (distancesFrom[sourceId] !== undefined && distancesTo[targetId] !== undefined && distancesFrom[sourceId] + distancesTo[targetId] <= k - 1) {
          allEdges[_i].addClass('highlighted');
        }
      } else if (direction === "DOWNSTREAM") {
        if (sourceId === "glyph27" && targetId === "glyph32") console.log(distancesFrom[sourceId] + " " + distancesTo[targetId]);

        if (distancesFrom[sourceId] !== undefined && distancesTo[targetId] !== undefined && distancesFrom[sourceId] + distancesTo[targetId] <= k - 1) {
          allEdges[_i].addClass('highlighted');
        }
      } else if (direction === "UPSTREAM") {
        if (sourceId === "glyph25" && targetId === "glyph27") console.log(distancesTo[sourceId] + " " + distancesFrom[targetId]);

        if (distancesTo[sourceId] !== undefined && distancesFrom[targetId] !== undefined && distancesTo[sourceId] + distancesFrom[targetId] <= k - 1) {
          allEdges[_i].addClass('highlighted');
        }
      }
    }

    return [commonnodes, commonedges];
  }

  function graphofinterest(roots, k) {
    var _cy$elements$compound = cy.elements().compoundbfs(roots, k, "DOWNSTREAM"),
        _cy$elements$compound2 = _slicedToArray(_cy$elements$compound, 3),
        forwardneighbornodes = _cy$elements$compound2[0],
        forwardneighboredges = _cy$elements$compound2[1],
        forwarddist = _cy$elements$compound2[2];

    var _cy$elements$compound3 = cy.elements().compoundbfs(roots, k, "UPSTREAM"),
        _cy$elements$compound4 = _slicedToArray(_cy$elements$compound3, 3),
        reverseneighbornodes = _cy$elements$compound4[0],
        reverseneighboredges = _cy$elements$compound4[1],
        reversedist = _cy$elements$compound4[2];

    var resultNodes = [],
        resultEdges = [];

    for (var i = 0; i < forwardneighbornodes.length; i++) {
      if (forwarddist[forwardneighbornodes[i].id()] !== undefined && reversedist[forwardneighbornodes[i].id()] && forwarddist[forwardneighbornodes[i].id()] + reversedist[forwardneighbornodes[i].id()] <= k) {
        //forwardneighbornodes[i].select();
        if (forwardneighbornodes[i].isParent()) forwardneighbornodes[i].addClass('highlightedParent');else forwardneighbornodes[i].addClass('highlighted');
        resultNodes.push(forwardneighbornodes[i]);
      }
    }

    for (var _i = 0; _i < forwardneighboredges.length; _i++) {
      console.log(forwardneighboredges[_i].source().id() + " ");

      if (forwarddist[forwardneighboredges[_i].source().id()] !== undefined && reversedist[forwardneighboredges[_i].target().id()] !== undefined && forwarddist[forwardneighboredges[_i].source().id()] + reversedist[forwardneighboredges[_i].target().id()] < k) {
        //forwardneighboredges[i].select(); 
        forwardneighboredges[_i].addClass('highlighted');

        resultEdges.push(forwardneighboredges[_i]);
      }
    }

    return [resultNodes, resultEdges];
  }

  function PathsFromTo(sources, targets, k, d, mod) {
    var _cy$elements$compound = cy.elements().compoundbfs(sources, k, mod === "directed" ? "DOWNSTREAM" : "BOTHSTREAM"),
        _cy$elements$compound2 = _slicedToArray(_cy$elements$compound, 3),
        nodesFromSources = _cy$elements$compound2[0],
        edgesFromSources = _cy$elements$compound2[1],
        distancesFromSources = _cy$elements$compound2[2];

    var _cy$elements$compound3 = cy.elements().compoundbfs(targets, k, mod === "directed" ? "UPSTREAM" : "BOTHSTREAM"),
        _cy$elements$compound4 = _slicedToArray(_cy$elements$compound3, 3),
        nodesToTargets = _cy$elements$compound4[0],
        edgesToTargets = _cy$elements$compound4[1],
        distancesToTargets = _cy$elements$compound4[2];

    var l = -1;

    for (var i = 0; i < targets.length; i++) {
      if (l == -1) l = distancesFromSources[targets[i].id()];
      if (distancesFromSources[targets[i].id()] < l) l = distancesFromSources[targets[i].id()];
    }

    var edges = cy.edges();

    for (var _i = 0; _i < edges.length; _i++) {
      var sourceId = edges[_i].source().id();

      var targetId = edges[_i].target().id();

      var minDistance = l + d >= k ? k : l + d;

      if (distancesFromSources[sourceId] !== undefined && distancesToTargets[targetId] !== undefined && distancesFromSources[sourceId] + distancesToTargets[targetId] + 1 <= minDistance) {
        //edges[i].source().addClass("highlighted");
        //edges[i].target().addClass("highlighted");
        edges[_i].addClass("highlighted");
      }

      if (mod === "undirected") {
        if (distancesFromSources[targetId] !== undefined && distancesToTargets[sourceId] !== undefined && distancesFromSources[targetId] + distancesToTargets[sourceId] + 1 <= minDistance) {
          //edges[i].source().addClass("highlighted");
          //edges[i].target().addClass("highlighted");
          edges[_i].addClass("highlighted");
        }
      }
    }

    var nodes = cy.nodes();

    for (var _i2 = 0; _i2 < nodes.length; _i2++) {
      var minDistance = l + d >= k ? k : l + d;

      if (distancesFromSources[nodes[_i2].id()] !== undefined && distancesToTargets[nodes[_i2].id()] !== undefined && distancesFromSources[nodes[_i2].id()] + distancesToTargets[nodes[_i2].id()] <= minDistance) {
        //edges[i].source().addClass("highlighted");
        //edges[i].target().addClass("highlighted"); 
        if (nodes[_i2].isParent() === true) nodes[_i2].addClass("highlightedParent");else nodes[_i2].addClass("highlighted");
      }
    }
  }

  function register(cytoscape) {
    cytoscape('collection', 'kneighborhood', kneighborhood);
    cytoscape('collection', 'compoundbfs', compoundbfs);
    cytoscape('collection', 'commonstream', commonstream);
    cytoscape('collection', 'graphofinterest', graphofinterest); // Paths Between shortest path 

    cytoscape('collection', 'PathsFromTo', PathsFromTo);
  }

  if (typeof window.cytoscape !== 'undefined') {
    register(window.cytoscape);
  }

  return register;

}));
