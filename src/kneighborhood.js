

export function kneighborhood(root,k,direction){
  //export burda yapılcak

  var Q = [];
  //var dist = {};

  var visited  = {};
  var compoundVisited = {};

  var kneighbors = [];

  //dist[ root.id() ] = 0; 
  //visited[root.id()] = true;

  let [neighbornodes, neighboredges,dist] = cy.elements().compoundbfs(root, k, direction);

  console.log(neighbornodes.length, neighboredges.length) ;
  //console.log(dist[neighbornodes[0].id()]);

  for( let i = 0; i < neighbornodes.length; i++)
       neighbornodes[i].select();
  for( let i = 0; i < neighboredges.length; i++)
       neighboredges[i].select();

  return [neighbornodes, neighboredges];

//  var cyy = cytoscape({container: document.getElementById('cyy')});
  Q.push(root);
  //kneighbors.push(root);
 // root = cy.$('f68');
//  console.log(root);
  /*console.log(root.isNode());
  console.log(root.connectedEdges()) ;
  console.log(nodes.length);*/
  while(Q.length !== 0){
      var node = Q.shift();
      
      var depth = dist [ node.id() ] ;

      console.log(node.id() + " " + dist[node.id()]);
      if( compoundVisited[ node.id()] !== true ){
      
      var anchestors = node.parents();
      anchestors = anchestors.union(node);
      
      var allNodesinCompounds = anchestors.descendants();

      allNodesinCompounds = allNodesinCompounds.union(anchestors);

      let noOfNodesinCompound = allNodesinCompounds.length;
      //console.log(anchestors.length);

      for( let i = 0; i < noOfNodesinCompound; i++){
           dist [ allNodesinCompounds[i].id() ] = depth;
           compoundVisited [ allNodesinCompounds[i].id() ] = true;

           if( visited[ allNodesinCompounds[i].id()] !== true ){
             visited[allNodesinCompounds[i].id()] = true;
             Q.push(allNodesinCompounds[i]);
           }

      }
    }
    var neighbors = node.neighborhood();

    var noOfNeighbors = neighbors.length;
    //console.log(noOfNeighbors);
    for( let i = 0; i < noOfNeighbors; i++ ){
         var neighbori = neighbors[i];
         if( neighbori.isNode() ){
           
             if( visited[neighbori.id()]!== true && depth+1 <= k ){
              dist[neighbori.id()] = depth+1;
               //console.log(neighbori.id());
               visited[neighbori.id()] = true;
               Q.push(neighbori);
               neighbori.select();
        //       for( let j = 0; j < neighbori.incomers().length; j++)
          //     console.log(neighbori.incomers()[j].id());
            //   console.log("end");
               
             }
              //console.log("end");
         }
      
    }
    

  }

  
      

      
      
      /*cy.layout({
        name: 'null'
    }).run();**/
      

      //return cyy ; 
} ;

//function 


function queryneighborhood( ) {
  console.log("Entered");
  cy.elements().kneighborhood(root,1, "DOWNSTREAM");
}