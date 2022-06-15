# Description
This repository includes several graph algorithms such as k-Neighborhood, Common Stream, Paths Between and Paths From To which can be used for querying compound graphs. These algorithms are the generalized versions of the ones developed for querying biological pathways whose details are explained [here](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2784781/). 

Here is a [demo](https://ivis-at-bilkent.github.io/cytoscape.js-graph-algos/demo.html).

Cite the following if you use this repository:

U. Dogrusoz, A. Cetintas, E. Demir and O. Babur, "Algorithms for effective querying of compound graph-based pathway databases", BMC Bioinformatics, 10(1), pp. 1-16, 2009.
                                                                          
# Dependencies

- Cytoscape.js ^3.2.0
 
# Details of Algorithms

**1 - k-Neighborhood Algorithm:** This algorithm finds the neighbors of source node set within a specified distance.

`kNeighborhood( sourceNodes, limit, direction)`


`sourceNodes`- Source node set of this algorithm.\
`limit` - Specified distance of this algorithm.\
`direction` - Direction of algorithm. It can be  "UPSTREAM", "DOWNSTREAM" or "BOTHSTREAM".\
Only incoming edges of nodes can be used if direction is "UPSTREAM".\
Only outgoing edges of nodes can be used if direction is "DOWNSTREAM".\
Every edges of nodes can be used if direction is "BOTHSTREAM".

Returns neighbor nodes and neighbor edges as a collection of Cytopscape.js.

Example:\
`var result = cy.elements().kNeighborhood(sourceNodes, limit, direction);`\
`result.neighborNodes` : neighbors of source nodes.\
`result.neighborEdges` : edges which are on paths from source nodes to neighbor nodes.

**2 - Common Stream Algorithm:** This algorithm finds the nodes which are common in the kNeighborhood of each source node within specified distance. These nodes are     called common nodes. Also, it finds the paths from source nodes to common nodes.

`commonStream( sourceNodes, limit, direction)`

`sourceNodes` - Source node set of this algorithm.\
`limit` - Specified distance of this algorithm.\
`direction` - Direction of algorithm. It can be  "UPSTREAM", "DOWNSTREAM" or "BOTHSTREAM".\
Only incoming edges of nodes can be used if direction is "UPSTREAM".\
Only outgoing edges of nodes can be used if direction is "DOWNSTREAM".\
Every edges of nodes can be used if direction is "BOTHSTREAM".

Returns common nodes , edges and nodes which are on the paths from source nodes to common nodes as a collection of Cytopscape.js. 

Example:\
`var result = cy.elements().commonStream(sourceNodes, limit, direction);`\
`result.commonNodes` : common nodes.\
`result.nodesOnPath` : nodes which are not common but are on the paths from source nodes to common nodes.\
`result.edgesOnPath` : edges which are on the paths from source nodes to common nodes.

**3 - Paths Between Algorithm:** This algorithm finds the paths which are between the source nodes within specified distance.

`pathsBetween( sourceNodes, limit, direction)`\
`sourceNodes` - Source node set of this algorithm.\
`limit` - Specified distance of this algorithm.\
`direction` - Direction of algorithm. It can be  "DIRECTED" or "UNDIRECTED".\
Only outgoing edges of nodes can be used if direction is "DIRECTED".\
Edges can be used bidirectionally if direction is "UNDIRECTED".

Returns nodes and edges on the paths between source nodes as a collection of Cytopscape.js.

Example:\
`var result = cy.elements().pathsBetween(sourceNodes, limit, direction);`\
`result.resultNodes` : nodes which are on the paths between source nodes.\
`result.resultEdges` : edges which are on the paths between source nodes.
  
**4 - Paths From To Algorithm:** This algorithm finds the paths from source nodes to target nodes within specified distance.

`pathsFromTo( sourceNodes, targetNodes, limit, furtherDistance, mod)`\
`sourceNodes` - Source node set of this algorithm.\
`targetNodes` - Target node set of this algorithm.\
`limit` - Specified distance of this algorithm.\
`furtherDistance` - which is used in calculation `min( shortestPathLength + furtherDistance, limit)`.\
`mod` -  Direction of algorithm. It can be  "UPSTREAM", "DIRECTED" or "UNDIRECTED".\
Only outgoing edges of nodes can be used if direction is "DIRECTED".\
Every edges of nodes can be used if direction is "UNDIRECTED".
  
Algorithm finds all the paths from source nodes to target nodes whose length not exceeding the result of the formula given above.\
shortestPathLength corresponds to the length of the shortest path from soure nodes to target nodes.

Returns nodes and edges on the paths from source nodes to target nodes as a collection of Cytopscape.js.

Example:\
`var result = cy.elements().pathsFromTo(sourceNodes, targetNodes, limit, furtherDistance, mod);`\
`result.nodesOnThePaths` : nodes which are on the paths from source nodes to target nodes.\
`result.edgesOnThePaths` : edges which are on the paths from source nodes to target nodes.

# Usage Instructions

Clone this repository.

```bash
git clone https://github.com/iVis-at-Bilkent/cytoscape.js-graph-algos.git
```                                                                                                
`npm run build` builds the library to `dist`, generating three files:

* `dist/cytoscape-graph-algos.esm.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/cytoscape-graph-algos.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
* `dist/cytoscape-graph-algos.cjs.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json             
    
 `npm test` builds the library, then tests it.
 
 # Team
[Yusuf Ziya Ozgul](https://github.com/YusufZiyaOzgul), [Hasan Balci](https://github.com/HasanBalci) and  [Ugur Dogrusoz](https://github.com/ugurdogrusoz) of [i-Vis at Bilkent University](https://github.com/iVis-at-Bilkent).
