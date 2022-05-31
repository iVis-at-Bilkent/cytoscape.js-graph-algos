# Description
This repository includes several graph algorithms which can be used for querying compound graph-based pathway databases. This repository is implemented as Cytoscape.js extension. k-neighborhood, CommonStream, Paths Between and Paths From to are the algorithms implemented in this extension. Details of these algorithms can be found [here](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2784781/). 

Here is a [demo](https://github.com/iVis-at-Bilkent/cytoscape.js-graph-algos/blob/master/demo.html).

This repository uses [fCoSE layout](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose) in its demo.

Cite the following you use this repository:

U. Dogrusoz, E. Giral, A. Cetintas, A. Civril and E. Demir, "A Layout Algorithm For Undirected Compound Graphs", Information Sciences, 179, pp. 980-994, 2009.
                                                                          
# Dependencies

    Cytoscape.js ^3.2.0
    cose-base ^2.0.0
    cytoscape-layout-utilities.js (optional for packing disconnected components) ^1.0.0

# Usage Instructions

Clone this repository.

```bash
git clone https://github.com/rollup/rollup-starter-lib
```                                                                                                
`npm run build` builds the library to `dist`, generating three files:

* `dist/cytoscape-graph-algos.esm.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/cytoscape-graph-algos.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
* `dist/cytoscape-graph-algos.cjs.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json             
    
 `npm test` builds the library, then tests it.
                                                                                                              

## License

[MIT](LICENSE).
