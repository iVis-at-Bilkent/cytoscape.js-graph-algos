


export function PathsFromTo( sources, targets, k,d,mod ){
       
       let [ nodesFromSources, edgesFromSources, distancesFromSources ] = cy.elements().compoundbfs(sources, k, mod === "directed" ? 
       "DOWNSTREAM" : "BOTHSTREAM");
       let [ nodesToTargets, edgesToTargets, distancesToTargets ] = cy.elements().compoundbfs(targets, k, mod === "directed" ? 
       "UPSTREAM" : "BOTHSTREAM"); 

       var l = -1;

       for( let i = 0; i < targets.length; i++){
            if( l == -1)
                l = distancesFromSources[targets[i].id()];
            if( distancesFromSources[targets[i].id()] < l )
                l = distancesFromSources[targets[i].id()];
       }

       var edges = cy.edges();

       for( let i = 0; i < edges.length; i++){
           var sourceId = edges[i].source().id();
           var targetId = edges[i].target().id();
           var minDistance = ( l+d >= k ? k : l+d);
           if( distancesFromSources[sourceId] !== undefined && distancesToTargets[targetId] !== undefined && 
            distancesFromSources[sourceId] + distancesToTargets[targetId] + 1 <= minDistance ){
               //edges[i].source().addClass("highlighted");
               //edges[i].target().addClass("highlighted");
               edges[i].addClass("highlighted");
           }

           if( mod === "undirected"){
           if( distancesFromSources[targetId] !== undefined && distancesToTargets[sourceId] !== undefined && 
            distancesFromSources[targetId] + distancesToTargets[sourceId] + 1 <= minDistance ){
               //edges[i].source().addClass("highlighted");
               //edges[i].target().addClass("highlighted");
               edges[i].addClass("highlighted");
           }
           }

       }
       var nodes = cy.nodes();
       for( let i = 0; i < nodes.length; i++){
        var minDistance = ( l+d >= k ? k : l+d);
        if( distancesFromSources[nodes[i].id()] !== undefined && distancesToTargets[nodes[i].id()] !== undefined && 
         distancesFromSources[nodes[i].id()] + distancesToTargets[nodes[i].id()]  <= minDistance ){
            //edges[i].source().addClass("highlighted");
            //edges[i].target().addClass("highlighted"); 
            if( nodes[i].isParent() === true)
            nodes[i].addClass("highlightedParent");
            else
            nodes[i].addClass("highlighted");
        }

    }

}