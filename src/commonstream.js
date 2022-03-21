


export function commonstream( roots, k, direction ){

       var count = {};

       var candidates = [];
       
       var commonnodes = [];
       var commonedges = [];

       for( let i = 0; i < roots.length; i++){
            let [ neighbornodes, neighboredges,dist] = cy.elements().compoundbfs(roots[i], k, direction);
            console.log(dist[neighbornodes[0].id()]);

            for( let j = 0; j < neighbornodes.length; j++){
                 console.log(neighbornodes[j].id());
                 if( count [neighbornodes[j].id()] === undefined ){
                     count [neighbornodes[j].id()] = 1;
                     candidates.push( neighbornodes[j] );
                 }
                 else 
                     count [neighbornodes[j].id()]++;
            }
            for( let j = 0; j < neighboredges.length; j++)
                 if( count [neighboredges[j].id()] === undefined ){
                     count [neighboredges[j].id()] = 1;
                     candidates.push( neighboredges[j] );
                 }
                 else 
                     count [neighboredges[j].id()]++;
      
       }
        while( candidates.length !== 0 ){
               var candidate = candidates.pop();
               if( count[ candidate.id()] === roots.length){
                   if( candidate.isNode()){
                       commonnodes.push(candidate);
                       candidate.addClass('highlighted');
                   }
                   else
                       commonedges.push(candidate);
                       candidate.addClass('highlighted');
                   //candidate.select();
               }       
        }
        return [commonnodes, commonedges];
    }