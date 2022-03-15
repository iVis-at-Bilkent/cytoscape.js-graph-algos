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
    neighbornodes[i].select();
  }

  for (var _i = 0; _i < neighboredges.length; _i++) {
    neighboredges[_i].select();
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
      var noOfNodesinCompound = allNodesinCompounds.length; //console.log(anchestors.length);

      for (var _i = 0; _i < noOfNodesinCompound; _i++) {
        dist[allNodesinCompounds[_i].id()] = depth;
        compoundVisited[allNodesinCompounds[_i].id()] = true;

        if (visited[allNodesinCompounds[_i].id()] !== true) {
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

  return [neighbornodes, neighboredges, dist];
  /*cy.layout({
    name: 'null'
  }).run();**/
  //return cyy ; 
}

function commonstream(roots, k, direction) {
  var count = {};
  var candidates = [];
  var commonnodes = [];
  var commonedges = [];

  for (var i = 0; i < roots.length; i++) {
    var _cy$elements$compound = cy.elements().compoundbfs(roots[i], k, direction),
        _cy$elements$compound2 = _slicedToArray(_cy$elements$compound, 3),
        neighbornodes = _cy$elements$compound2[0],
        neighboredges = _cy$elements$compound2[1],
        dist = _cy$elements$compound2[2];

    console.log(dist[neighbornodes[0].id()]);

    for (var j = 0; j < neighbornodes.length; j++) {
      console.log(neighbornodes[j].id());

      if (count[neighbornodes[j].id()] === undefined) {
        count[neighbornodes[j].id()] = 1;
        candidates.push(neighbornodes[j]);
      } else count[neighbornodes[j].id()]++;
    }

    for (var _j = 0; _j < neighboredges.length; _j++) {
      if (count[neighboredges[_j].id()] === undefined) {
        count[neighboredges[_j].id()] = 1;
        candidates.push(neighboredges[_j]);
      } else count[neighboredges[_j].id()]++;
    }
  }

  while (candidates.length !== 0) {
    var candidate = candidates.pop();

    if (count[candidate.id()] === roots.length) {
      if (candidate.isNode()) commonnodes.push(candidate);else commonedges.push(candidate);
      candidate.select();
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
      forwardneighbornodes[i].select();
      resultNodes.push(forwardneighbornodes[i]);
    }
  }

  for (var _i = 0; _i < forwardneighboredges.length; _i++) {
    console.log(forwardneighboredges[_i].source().id() + " ");

    if (forwarddist[forwardneighboredges[_i].source().id()] !== undefined && reversedist[forwardneighboredges[_i].target().id()] !== undefined && forwarddist[forwardneighboredges[_i].source().id()] + reversedist[forwardneighboredges[_i].target().id()] < k) {
      forwardneighboredges[_i].select();

      resultEdges.push(forwardneighboredges[_i]);
    }
  }

  return [resultNodes, resultEdges];
}

function register(cytoscape) {
  cytoscape('collection', 'kneighborhood', kneighborhood);
  cytoscape('collection', 'compoundbfs', compoundbfs);
  cytoscape('collection', 'commonstream', commonstream);
  cytoscape('collection', 'graphofinterest', graphofinterest);
}

if (typeof window.cytoscape !== 'undefined') {
  register(window.cytoscape);
}

export default register;
