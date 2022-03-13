import {kneighborhood} from "./kneighborhood.js";
import {compoundbfs} from "./compoundbfs.js";
import {commonstream} from "./commonstream.js"
import {graphofinterest} from "./graphofinterest.js";

export default function register(cytoscape){
	cytoscape('collection', 'kneighborhood', kneighborhood);
	cytoscape('collection', 'compoundbfs', compoundbfs);
	cytoscape('collection', 'commonstream', commonstream);
	cytoscape('collection', 'graphofinterest', graphofinterest);
}


if(typeof window.cytoscape !== 'undefined'){
	register(window.cytoscape);
   }