export function graphofinterest(roots, k ){

    let [forwardneighbornodes, forwardneighboredges, forwarddist] = cy.elements().compoundbfs(roots, k, "DOWNSTREAM");
    let [reverseneighbornodes, reverseneighboredges, reversedist] = cy.elements().compoundbfs(roots, k, "UPSTREAM");

    var resultNodes = [], resultEdges = [];

    for( let i = 0; i < forwardneighbornodes.length; i++){
        if( forwarddist[forwardneighbornodes[i].id()] !== undefined && reversedist[forwardneighbornodes[i].id()] &&
        forwarddist[forwardneighbornodes[i].id()] + reversedist[forwardneighbornodes[i].id()] <= k 
        ){
        forwardneighbornodes[i].select();
        resultNodes.push(forwardneighbornodes[i]);
        }
    }

    for( let i = 0; i < forwardneighboredges.length; i++){
        console.log( forwardneighboredges[i].source().id() + " " );
        if( forwarddist[forwardneighboredges[i].source().id()] !==undefined && 
         reversedist[forwardneighboredges[i].target().id()] !==undefined &&
         forwarddist[forwardneighboredges[i].source().id()] + reversedist[forwardneighboredges[i].target().id()] < k 
         ){
             
            forwardneighboredges[i].select(); 
            resultEdges.push(forwardneighboredges[i]);
         }
    }
    

    return [resultNodes, resultEdges];


}