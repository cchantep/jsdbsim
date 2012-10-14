dbsimu['initialdata'] = {
  _fireEvents: false, // fire triggers, or not

  // Initial data for link_tbl
  "infolink.link_tbl": [
      { id: "l1", 
	assoc_name: "descendant", 
	source_node_id: "node1", 
	target_node_id: "node2" }
  ],

  // Initial data for assoc_features_tbl
  "infolink.assoc_features_tbl": [
      { assoc_name: "descendant",
	flags: "|t|" }
  ],

  // Initial data for link_graph_tbl
  "infolink.link_graph_tbl": [
      { id: "1", 
	source_node_id: "node1",
	target_node_id: "node2",
	source_id: null,
	middle_id: null,
	link_id: "l1",
	assoc_name: "descendant"
      }
  ]
}
