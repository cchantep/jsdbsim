function afterLinkInsert(newRow) {
  // Select association features
  var results = dbsimu.tables["infolink.assoc_features_tbl"].
    selectWhere({assoc_name: newRow.assoc_name});
  var assoc_features = results[0];
  var circularity = (assoc_features.flags.indexOf("|+c|") != -1);
  var results;
  
  if (!circularity) { // does not accept circularity
    results = dbsimu.tables["infolink.link_graph_tbl"].
      selectWhere({ source_node_id: newRow.target_node_id,
				      target_node_id: newRow.source_node_id,
				      assoc_name: newRow.assoc_name });

    if (results.length > 0) { // circularity found
      throw "Circularity in link graph not permitted for: " +
	newRow.assoc_name;

    }
  }

  // ---

  var data = {
    source_id: null,
    middle_id: null,
    source_node_id: newRow.source_node_id,
    target_node_id: newRow.target_node_id,
    link_id: newRow.id,
    assoc_name: newRow.assoc_name,
    id: window.prompt("Graph id")
  };

  dbsimu.tables["infolink.link_graph_tbl"].
    insert(data);

}

function afterGraphInsert(newRow) {
  // Select association features
  var results = dbsimu.tables["infolink.assoc_features_tbl"].
    selectWhere({assoc_name: newRow.assoc_name});
  var assoc_features = results[0];

  if (assoc_features.flags && 
      assoc_features.flags.indexOf("|t|") != -1) {

    transitiveInsertFrom(newRow);
  }
}

function transitiveInsertFrom(newRow) {
  var t = dbsimu.tables["infolink.link_graph_tbl"];
  var pred = t.selectWhere({assoc_name: newRow.assoc_name,
 			    target_node_id: newRow.source_node_id});
  var succ = t.selectWhere({assoc_name: newRow.assoc_name,
  			    source_node_id: newRow.target_node_id});

  // List of predecessors and successors
  var l = pred.concat(succ);
  
  var i;
  var compiledSourceId;
  var compiledTargetId;
  var sourceId;
  var middleId;
  var tdata;
  for (i = 0; i < l.length; i++) {
    if (l[i].target_node_id == newRow.source_node_id) { // is precessor
      compiledSourceId = l[i].source_node_id;
      compiledTargetId = newRow.target_node_id;
      sourceId = l[i].id;
      middleId = newRow.id;
    } else { // is ancestor
      compiledSourceId = newRow.source_node_id;
      compiledTargetId = l[i].target_node_id;
      sourceId = newRow.id;
      middleId = l[i].id;
    }

    // Prepare transitive data
    tdata = {
      id: window.prompt("Graph id"),
      link_id: newRow.link_id,
      source_id: sourceId,
      middle_id: middleId,
      source_node_id: compiledSourceId,
      target_node_id: compiledTargetId,
      assoc_name: newRow.assoc_name,
      assoc_flags: newRow.assoc_flags
    };

    t.insert(tdata);
  }
}

// ---

