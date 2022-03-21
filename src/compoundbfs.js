export  function compoundbfs(roots,k,direction){
    //export burda yapılcak
  
    var Q = [];
    var dist = {};
  
    var visited  = {};
    var compoundVisited = {};
  
    var neighbornodes = [];
    var neighboredges = [];


    for( let i = 0; i < roots.length; i++){
    dist[ roots[i].id() ] = 0; 
    visited[roots[i].id()] = true;
    Q.push(roots[i]);
    }
  
  //  var cyy = cytoscape({container: document.getElementById('cyy')});
    
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
        console.log( node.id() + " " +  noOfNodesinCompound);
  
        for( let i = 0; i < noOfNodesinCompound; i++){
             dist [ allNodesinCompounds[i].id() ] = depth;
             compoundVisited [ allNodesinCompounds[i].id() ] = true;
  
             if( visited[ allNodesinCompounds[i].id()] !== true ){
               neighbornodes.push(allNodesinCompounds[i]);             
          
               visited[allNodesinCompounds[i].id()] = true;
               Q.push(allNodesinCompounds[i]);
             }
  
        }
     }
      
      var neighbors;

      if( direction === "BOTHSTREAM")
          neighbors = node.neighborhood();
      else if( direction === "UPSTREAM")
          neighbors = node.incomers();
      else if (direction === "DOWNSTREAM" )
          neighbors = node.outgoers();
  
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
                 //neighbori.select();
                 neighbornodes.push(neighbori);
          //       for( let j = 0; j < neighbori.incomers().length; j++)
            //     console.log(neighbori.incomers()[j].id());
              //   console.log("end");
                 
               }
                //console.log("end");
           }

           else if( neighbori.isEdge() && depth < k){
               neighboredges.push(neighbori);

           }
        
      }
      
    }
  
    return [neighbornodes, neighboredges,dist ];
    
        
  
        
        
        /*cy.layout({
          name: 'null'
      }).run();**/
        
  
        //return cyy ; 
  } ;