function afterVersionInsert(newRow) {
  var nodeData = {
    id: newRow.id,
    query_lang: "lucene",
    query_stmt: "toto"
  };

  dbsimu.tables["infolink.node_tbl"].
    insert(nodeData);

}

function beforeVersionDelete(oldRow) {
  // Get associated node
  var nodes = dbsimu.tables["infolink.node_tbl"].
    selectWhere({id: oldRow.id});

  // Get links
  var sucs = dbsimu.tables["infolink.link_tbl"].
    selectWhere({source_node_id: oldRow.id});
  var pres = dbsimu.tables["infolink.link_tbl"].
    selectWhere({target_node_id: oldRow.id});

  // Repair graph
  var y;
  var x;
  var linkData;
  for (x = 0; x < sucs.length; x++) {
    alert("#pres[" + x + "].source_node_id=" + pres[x].source_node_id);

    for (y = 0; y < sucs.length; y++) {
      alert("#sucs[" + y + "].target_node_id=" + sucs[y].target_node_id);

      linkData = {
	id: window.prompt("Link id"),
	assoc_name: "version_successor",
	source_node_id: pres[x].source_node_id,
	target_node_id: sucs[y].target_node_id
      };

      dbsimu.tables["infolink.link_tbl"].
	insert(linkData);
    }
  }

  // Delete associated node
  dbsimu.tables["infolink.node_tbl"].
    deleteDatas(nodes);
  
}

function beforeNodeDelete(oldRow) {
  var links = dbsimu.tables["infolink.link_tbl"].
    selectWhere({source_node_id: oldRow.id});

  dbsimu.tables["infolink.link_tbl"].
    deleteDatas(links);

  links = dbsimu.tables["infolink.link_tbl"].
    selectWhere({target_node_id: oldRow.id});
  
  dbsimu.tables["infolink.link_tbl"].
    deleteDatas(links);
}
