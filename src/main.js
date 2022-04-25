import {kneighborhood} from "./kneighborhood.js";
import {CompoundBfs} from "./CompoundBfs.js";
import {CommonStream} from "./CommonStream.js"
import {PathsBetween} from "./PathsBetween.js";
import { PathsFromTo } from "./PathsFromTo.js";

export default function register(cytoscape){
	cytoscape('collection', 'kneighborhood', kneighborhood);
	cytoscape('collection', 'CompoundBfs', CompoundBfs);
	cytoscape('collection', 'CommonStream', CommonStream); 
	cytoscape('collection', 'PathsBetween', PathsBetween);
	cytoscape('collection', 'PathsFromTo', PathsFromTo);
}
if(typeof window.cytoscape !== 'undefined'){
	register(window.cytoscape);
   }