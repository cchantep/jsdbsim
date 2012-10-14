dbsimu['initialdata'] = {
  _fireEvents: true, // fire triggers, or not

  // Initial data for version_tbl
  "istory.version_tbl": [
      { id: "va", 
	name: "0" },
      { id: "vb", 
	name: "0.1.0" },
      { id: "vc", 
	name: "0.2.0" },
      { id: "vd",
	name: "0.1.1" },
      { id: "ve",
	name: "0.2.1" }
  ],

  // Initial data for assoc_features_tbl
  "infolink.assoc_features_tbl": [
      { assoc_name: "version_successor",
	flags: "|t|" }
  ],

  // Initial data for link_tbl
  "infolink.link_tbl": [
      { id: "l1",
	assoc_name: "version_successor",
	source_node_id: "va",
	target_node_id: "vb" },
      { id: "l2",
	assoc_name: "version_successor",
	source_node_id: "va",
	target_node_id: "vc" },
      { id: "l3",
	assoc_name: "version_successor",
	source_node_id: "vb",
	target_node_id: "vd" },
      { id: "l4",
	assoc_name: "version_successor",
	source_node_id: "vc",
	target_node_id: "ve"}
  ]

}
