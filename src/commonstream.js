


function reverseDirection(direction) {
    if( direction === "BOTHSTREAM")
        return direction;
    if( direction === "UPSTREAM")
        return "DOWNSTREAM";
    if( direction === "DOWNSTREAM")
        return "UPSTREAM";
}

export function commonstream( roots, k, direction ){

       var count = {};

       var candidates = [];
       
       var commonnodes = [];
       var commonedges = [];
       var distancesFrom = {};


       for( let i = 0; i < roots.length; i++){
            let [ neighbornodes, neighboredges,dist] = cy.elements().compoundbfs(roots[i], k, direction);
            for( let j = 0; j < neighboredges.length; j++)
                 console.log( i + " " + neighboredges[j].id() + " Edges");
            console.log(dist[neighbornodes[0].id()] + " " + i);

            for( let j = 0; j < neighbornodes.length; j++){
                if( neighbornodes[j].id() === "glyph27")
                    console.log( "Distance"  + dist[neighbornodes[j].id()] );
                 console.log(neighbornodes[j].id() + " " + i + " " + dist[neighbornodes[j].id()]);
                 if( count [neighbornodes[j].id()] === undefined ){
                     count [neighbornodes[j].id()] = 1;
                     distancesFrom[neighbornodes[j].id()] = dist[neighbornodes[j].id()];
                     candidates.push( neighbornodes[j] );
                 }
                 else {
                     count [neighbornodes[j].id()]++;
                     if( distancesFrom[neighbornodes[j].id()] > dist[neighbornodes[j].id()] )
                         distancesFrom[neighbornodes[j].id()] = dist[neighbornodes[j].id()];  
                 }
            }
            for( let j = 0; j < neighboredges.length; j++)
                 if( count [neighboredges[j].id()] === undefined ){
                     count [neighboredges[j].id()] = 1;
                   //  candidates.push( neighboredges[j] );
                 }
                 else 
                     count [neighboredges[j].id()]++;
      
       } 
       while( candidates.length !== 0 ){
               var candidate = candidates.pop();
               if( count[ candidate.id()] === roots.length){
                   if( candidate.isNode()){
                       console.log(candidate.id());

                       commonnodes.push(candidate);
                       if(candidate.isParent() === true)
                          candidate.addClass('highlightedParent');
                       else 
                       candidate.addClass('highlighted');
                   }
                   else{
                       commonedges.push(candidate);
                       //candidate.addClass('highlighted');
                   }
                   //candidate.select();
               }       
            }
        let [ neighbornodes, neighboredges,distancesTo] = cy.elements().compoundbfs(commonnodes, k, reverseDirection(direction ));    
        var allEdges = cy.edges();
        for( let i = 0; i < allEdges.length; i++){
             var sourceId = allEdges[i].source().id();
             var targetId = allEdges[i].target().id();


             if( direction === "BOTHSTREAM"){ 
                 if( distancesFrom[sourceId] !== undefined && distancesTo[targetId] !== undefined && 
                    distancesFrom[ sourceId ] + distancesTo[targetId] <= k - 1){
                        allEdges[i].addClass('highlighted');
                     
                 }
             }

             else if( direction === "DOWNSTREAM" ){
                 if( sourceId === "glyph27" && targetId === "glyph32" )
                     console.log( distancesFrom[sourceId] + " " + distancesTo[targetId]);
                if( distancesFrom[sourceId] !== undefined && distancesTo[targetId] !== undefined && 
                    distancesFrom[ sourceId ] + distancesTo[targetId] <= k - 1){
                        allEdges[i].addClass('highlighted');
                     
                 } 

             }

             else if( direction === "UPSTREAM"){
                if( sourceId === "glyph25" && targetId === "glyph27" )
                console.log( distancesTo[sourceId] + " " + distancesFrom[targetId]);
                if( distancesTo[sourceId] !== undefined && distancesFrom[targetId] !== undefined && 
                    distancesTo[ sourceId ] + distancesFrom[targetId] <= k - 1){
                        allEdges[i].addClass('highlighted');
                     
                 } 


             }
        }
        return [commonnodes, commonedges];
    }