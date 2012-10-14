dbsimu['tabledefs'] = {
  // Definition for table "node_tbl" in schema "infolink"
  "infolink.node_tbl": {
    columns: ["id", "query_lang", "query_stmt" ],

    primaryKey: ["id"],

    beforeDelete: [ beforeNodeDelete ]
  },

  // Definition for table "link_tbl" in schema "infolink"
  "infolink.link_tbl": {
    columns: ["id", "assoc_name", "source_node_id", "target_node_id"],

    primaryKey: ["id"],
    references: [
	{
	  localColumns: ["assoc_name"],
	  table: "assoc_features_tbl", /* by default look for table
					 in same schema */
	  referencedColumns: ["assoc_name"],
	  onInsert: null,
	  onUpdate: null,
	  onDelete: null
	},

	{
	  localColumns: ["source_node_id"],
	  table: "node_tbl",
	  referencedColumns: ["id"]
	},

	{
	  localColumns: ["target_node_id"],
	  table: "node_tbl",
	  referencedColumns: ["id"]
	}
    ],

    beforeInsert: null,
    afterInsert: [ afterLinkInsert ],

    beforeDelete: null,
    afterDelete: null,

    beforeUpdate: null,
    afterUpdate: null
  },

  // Definition for table "assoc_features_tbl" in schema "infolink"
  "infolink.assoc_features_tbl": {
    columns: ["assoc_name", "flags"],
    primaryKey: ["assoc_name"]
  },

  // Definition for table "link_graph_tbl" in schema "infolink"
  "infolink.link_graph_tbl": {
    columns: ["id", 
	      "source_id", "middle_id",
	      "source_node_id", "target_node_id",
	      "link_id", "assoc_name" ],
    primaryKey: ["id"],

    afterInsert: [ afterGraphInsert ],
    
    references: [
	{
	  localColumns: ["source_id"],
	  table: "link_graph_tbl",
	  referencedColumns: ["id"],
	  onInsert: null,
	  onUpdate: null,
	  onDelete: "cascade"
	},

	{
	  localColumns: ["middle_id"],
	  table: "link_graph_tbl",
	  referencedColumns: ["id"],
	  onInsert: null,
	  onUpdate: null,
	  onDelete: "cascade"
	},

	{
	  localColumns: ["link_id"],
	  table: "link_tbl",
	  referencedColumns: ["id"],
	  onInsert: null,
	  onUpdate: null,
	  onDelete: "cascade"
	},

	{
	  localColumns: ["assoc_name"],
	  table: "assoc_features_tbl",
	  referencedColumns: ["assoc_name"],
	  onInsert: null,
	  onUpdate: null,
	  onDelete: "cascade"
	}
    ]
  },

  // Definition for table "version_tbl" in schema "istory"
  "istory.version_tbl": {
    columns: ["id", "name"],

    primaryKey: ["id"],

    afterInsert: [ afterVersionInsert ],
    beforeDelete: [ beforeVersionDelete ]
  }
};
