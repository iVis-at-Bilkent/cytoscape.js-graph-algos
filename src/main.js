import {kneighborhood} from "./kneighborhood.js";
import {compoundbfs} from "./compoundbfs.js";
import {commonstream} from "./commonstream.js"
import {graphofinterest} from "./graphofinterest.js";
import { PathsFromTo } from "./PathsFromTo.js";

export default function register(cytoscape){
	cytoscape('collection', 'kneighborhood', kneighborhood);
	cytoscape('collection', 'compoundbfs', compoundbfs);
	cytoscape('collection', 'commonstream', commonstream); 
	cytoscape('collection', 'graphofinterest', graphofinterest); // Paths Between shortest path 
	cytoscape('collection', 'PathsFromTo', PathsFromTo);
}


if(typeof window.cytoscape !== 'undefined'){
	register(window.cytoscape);
   }