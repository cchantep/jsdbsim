// Namespace
var dbsimu = {
  /**
   * Tables dictionary
   */
  tables: {},

  /**
   * Insert data into table from DOM input element.
   *
   * @param tableName
   * @param inputIds Id of DOM input element from which
   * values will be get
   */
  insertInto: function(tableName, inputIds) {
    var data = [];

    var i;
    var input;
    var n;
    for (i = 0; i < inputIds.length; i++) {
      n = inputIds[i];
      input = document.getElementById(n);
      n = n.substring(tableName.length+1);

      data[n] = input.value;
    }

    this.tables[tableName].insert(data, this._insertHandler);
  },

  /**
   * Delete table row.
   *
   * @param tableName
   * @param evtSource Javascript event source (button)
   */
  deleteFrom: function(tableName, evtSource) {
    var row = evtSource.parentNode.parentNode;

    this.tables[tableName].deleteByRowElement(row);
  },

  /**
   * Create table space
   *
   * @param name Table space name
   * @return Table space DOM element
   */
  _createTableSpace: function(name) {
    var ts = document.getElementById("name");
    var b = document.getElementsByTagName("body")[0];

    if (ts) {
      ts.parentNode.removeChild(ts);
    }

    ts = document.createElement("table");
    var tbody = document.createElement("tbody");

    ts.appendChild(tbody);

    ts.setAttribute("class", "dataTableSpace");
    ts.setAttribute("id", name);
    
    b.appendChild(ts);

    return ts;
  },

  /**
   * Create index for all tables of all table spaces
   *
   * @param indexName
   * @return DOM table index
   */
  _createTableIndex: function(indexName) {
    var b = document.getElementsByTagName("body")[0];
    var di = document.getElementById(indexName);
    var it = document.createElement("h6");
    var tl = document.createElement("ul");

    if (di) {
      di.parentNode.removeChild(di);
    }

    di = document.createElement("div");

    di.setAttribute("id", indexName);
    di.setAttribute("class", "dataTableIndex");

    it.appendChild(document.createTextNode("Table index"));

    di.appendChild(it);
    di.appendChild(tl);

    b.appendChild(di);

    return di;
  },

  /**
   * Add table item in table index.
   *
   * @param tableName Name of table
   */
  _addTableToIndex: function(tableName) {
    var tableIndex = document.getElementById("dataTableIndex");
    var tl = tableIndex.getElementsByTagName("ul")[0];
    var li = document.createElement("li");
    var a = document.createElement("a");
    var schemaName = null;

    var idx = -1;
    if ((idx = tableName.indexOf(".")) != -1) {
      schemaName = tableName.substring(0, idx);
    }

    a.setAttribute("href", "#" + tableName);

    li.appendChild(a);

    if (idx == -1) {
      a.appendChild(document.createTextNode(tableName));
    } else {
      a.appendChild(document.
		    createTextNode(tableName.
				   substring(idx+1)));

      var se = document.createElement("span");

      se.setAttribute("class", "schemaName");

      se.appendChild(document.createTextNode(schemaName));

      li.appendChild(se);
    }
    
    tl.appendChild(li);
  },

  /**
   * Create table in DOM
   *
   * @param tableName Qualified table name (prefixed with schema)
   * @param columnNames
   * @return DOM table
   */
  _createDOMTable: function(tableName, columnNames) {
    var b = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    var tableSpace = document.getElementById("schemas");
    var tableIndex = document.getElementById("dataTableIndex");
    var existing = document.getElementById(tableName);
    var schemaName = null;

    var idx;
    if ((idx = tableName.indexOf(".")) != -1) {
      schemaName = tableName.substring(0, idx);
    }

    if (!tableIndex) {
      tableIndex = this._createTableIndex("dataTableIndex");
    }

    if (!tableSpace) {
      tableSpace = this._createTableSpace("schemas");
    }

    if (existing) {
      // Keep table once in DOM
      var p = existing.parentNode;
    
      p.removeChild(existing);
    }

    var spacer = document.getElementById(schemaName);
    var spacec;

    if (!spacer) {
      var spaceb = tableSpace.tBodies[0];
      spacer = spaceb.insertRow(-1);

      spacer.setAttribute("id", schemaName);

      spacec = spacer.insertCell(-1);

      var spacet = document.createElement("table");

      spacec.appendChild(spacet);

      spaceb = document.createElement("tbody");

      spacet.appendChild(spaceb);

      spacer = spaceb.insertRow(-1);
      spacec = spacer.insertCell(-1);
    } else {
      spacec = spacer.getElementsByTagName("td")[0];
      var spacet = spacec.getElementsByTagName("table")[0];
      spacer = spacet.tBodies[0].rows[0];
      
      spacec = spacer.insertCell(-1);
    }

    spacec = spacer.insertCell(-1);

    spacec.appendChild(table);
    b.appendChild(tableSpace);

    table.setAttribute("id", tableName);
    table.setAttribute("class", "dataTable");

    // Table head
    var thead = table.createTHead();
    var hrow = thead.insertRow(-1);

    var hcell;
    var celltxt;
    var i;
    for (i = 0; i < columnNames.length; i++) {
      hcell = document.createElement("th");
      celltxt = document.createTextNode(columnNames[i]);
      
      hcell.appendChild(celltxt);
      hrow.appendChild(hcell);
    }

    // Add caption
    var cap = table.createCaption();
    var tanch = document.createElement("a");
    var captxt = document.createTextNode("Table: " + tableName);

    tanch.setAttribute("name", tableName);

    tanch.appendChild(captxt);
    cap.appendChild(tanch);

    return table;
  },

  /**
   * Load and bind table data from table definitions.
   * To make it work you should have load un configuration
   * script defining table.
   * If initial datas are set, put them in tables.
   */
  bindTableDefinitions: function() {
    var initiald = (this["initialdata"]) ? this["initialdata"] : [];
    
    var table;
    var defName;
    var schemaName;
    var def;
    var i;
    var d;
    var idx;
    for (defName in this["tabledefs"]) {
      def = this["tabledefs"][defName];

      if ((idx = defName.indexOf(".")) != -1) {
	schemaName = defName.substring(0, idx);
      }

      this._createDOMTable(defName, def.columns);

      table = this.bindDataTable(defName);

      // Insert
      table._beforeInsert = def['beforeInsert'];
      table._afterInsert = def['afterInsert'];
      // Delete
      table._beforeDelete = def['beforeDelete'];
      table._afterDelete = def['afterDelete'];
      // Update
      table._beforeUpdate = def['beforeUpdate'];
      table._afterUpdate = def['afterUpdate'];

      // Primary key and foreign key references
      table.primaryKey = def['primaryKey'];
      table.references = def['references'];

      var i;
      var t;
      var r;
      for (i = 0; table.references && i < table.references.length; i++) {
	t = table.references[i].table;
	r = {
	  table: defName,
	  localColumns: table.references[i].referencedColumns,
	  referencedColumns: table.references[i].localColumns,
	  onInsert: table.references[i].onInsert,
	  onUpdate: table.references[i].onUpdate,
	  onDelete: table.references[i].onDelete
	}

	if (t.indexOf(".") == -1) {
	  t = schemaName + "." + t;
	  table.references[i].table = t;
	}

	if (!this.tables[t]) {
	  this.tables[t] = new DataTable(t, null, null);
	}

	if (!this.tables[t]._inverseRef) {
	  this.tables[t]._inverseRef = [ r ];
	} else {
	  this.tables[t]._inverseRef.push(r);
	}
      }

      this._addTableToIndex(defName);

      if (!initiald[defName]) { // no initial data
	continue;
      } 
    }

    // Insert initial data
    var insertFn = (initiald._fireEvents) ?
      "insert" : "_insert";

    delete initiald._fireEvents;

    var i;
    for (defName in initiald) {
      for (i = 0; i < initiald[defName].length; i++) {
	this.tables[defName][insertFn](initiald[defName][i]);
      }
    }
  },
  
  /**
   * Bind data table to DOM table element.
   *
   * @param tableName Table name, and id of matching DOM element
   * @return Bound data table
   */
  bindDataTable: function(tableName) {
    var table = document.getElementById(tableName);
    var editor = table.tHead.insertRow(-1);
    var colDecl = table.getElementsByTagName("th");
    var bodies = table.getElementsByTagName("tbody");

    editor.setAttribute("class", "dataTableEditor");

    var i;
    for (i = 0; i < bodies.length; i++) {
      table.removeChild(bodies);
    }

    var dataBody = document.createElement("tbody");

    table.appendChild(dataBody);

    var c;
    var input;
    var n;
    var buff = "[";
    var cols = new Array();
    var txt;
    for (i = 0; i < colDecl.length; i++) {
      txt = colDecl[i].firstChild.nodeValue;
      n = tableName + "_" + txt;
      c = editor.insertCell(-1);
      input = document.createElement("input");

      input.setAttribute("type", "text");
      input.setAttribute("name", n);
      input.setAttribute("id", n);
      input.setAttribute("value", "");

      if (i > 0) {
	buff += ",";
      }

      buff += "'" + n + "'";

      c.appendChild(input);

      cols.push(txt); // keep column name
    }

    buff += "]";

    c = editor.insertCell(-1);
    input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("value", "OK");
    input.setAttribute("onclick", 
		       "dbsimu.insertInto(\"" + tableName + 
		       "\", eval(\"" + buff + "\"))");

    c.appendChild(input);

    // Append extra col for controls
    var topRow = colDecl[i-1].parentNode;
    var extraCell = document.createElement("th");

    extraCell.setAttribute("class", "extraCell");
    
    topRow.appendChild(extraCell);

    if (this.tables[tableName]) {
      this.tables[tableName]._domElement = table;
      this.tables[tableName]._cols = cols;

      return this.tables[tableName];
    }

    return (this.tables[tableName] = new DataTable(tableName, table, cols));
  },

  /**
   * Add |trigger| to data table.
   *
   * @param tableName
   * @param when {"before", "after"}
   * @param what {"insert", "delete", "update"}
   * @param trigger Callback function used as trigger
   */
  addTrigger: function(tableName, when, what, trigger) {
    var table = this.tables[tableName];
    var w = what.substring(0, 1).toUpperCase() +
    what.substring(1).toLowerCase();
    
    var n = "_" + when + w;
    
    if (table[n] == null) {
      table[n] = new Array();
    }

    table[n].push(trigger);
  },

  /**
   * Returns string value for a foreign key reference
   *
   * @param tableName
   * @param fkRef
   */
  inverseRefAsString: function(tableName, fkRef) {
    var refstr = "Foreign key on " + fkRef.table + "(";

    var i;
    for (i = 0; i < fkRef.referencedColumns.length; i++) {
      if (i > 0) {
	refstr += ", ";
      }

      refstr += fkRef.referencedColumns[i];
    }

    refstr += ") referencing " + tableName + "(";

    for (i = 0; i < fkRef.localColumns.length; i++) {
      if (i > 0) {
	refstr += ", ";
      }
	
      refstr += fkRef.localColumns[i];
    }

    refstr += ")";

    return refstr;
  },

  /**
   * Returns string value for a foreign key reference
   *
   * @param tableName
   * @param fkRef
   */
  refAsString: function(tableName, fkRef) {
    var refstr = "Foreign key on " + tableName + "(";

    var i;
    for (i = 0; i < fkRef.localColumns.length; i++) {
      if (i > 0) {
	refstr += ", ";
      }

      refstr += fkRef.localColumns[i];
    }

    refstr += ") referencing " + fkRef.table + "(";

    for (i = 0; i < fkRef.referencedColumns.length; i++) {
      if (i > 0) {
	refstr += ", ";
      }
	
      refstr += fkRef.referencedColumns[i];
    }

    refstr += ")";

    return refstr;
  },

  /**
   * Returns datas as string.
   *
   * @param datas
   */
  datasAsString: function(datas) {
    var str = "";

    var d;
    var i = 0;
    for (d in datas) {
      if (i++ > 0) {
	str += ", ";
      }

      str += this.dataAsString(d, datas[d]);
    }

    return str;
  },

  /**
   * Return data as string.
   *
   * @param dataName
   * @param dataVal
   */
  dataAsString: function(dataName, dataVal) {
    return dataName + "(" + dataVal + ")";
  },

  /**
   * Default signal handler for insert
   *
   * @param tableName
   * @param signal
   */
  _insertHandler: function(tableName, signal) {
    window.alert("dbsimu[" + tableName + "]: " +
		 "An error has occured on insert: " + signal);

  }
};

// ---

/**
 * Initialize a data table.
 *
 * @param name Table name
 * @param domElement Matching DOM element
 * @param cols Name of table columns
 */
function DataTable(name, domElement, cols) {
  this._name = name;
  this._domElement = domElement;
  this._cols = cols;
}

DataTable.prototype = {
  // Properties
  primaryKey: null,
  references: null,
  _inverseRef: null,

  _name: null,
  _cols: null,
  _domElement: null,

  _beforeInsert: null,
  _afterInsert: null,
  _beforeUpdate: null,
  _afterUpdate: null,
  _beforeDelete: null,
  _afterDelete: null,

  // Functions

  /**
   * @fn insert(data, handler)
   * @brief Insert |data| into this table.
   * @param data Data to be inserted
   * @param handler Signal handler, if null signal will get up until caught
   */
  insert: function(data, handler) {
    var b = this._domElement.tBodies[0];
    var row = null;

    try {
      this._fire("before", "insert", null, data);

      row = this._insert(data);

      // Foreign keys checks
      var i;
      var j;
      var fki;
      for (i = 0; this.references && i < this.references.length; i++) {
	fki = this._foreignKey(this.references[i].localColumns, data);
	fki = this._remoteKey(this.references[i], fki);

	rr = dbsimu.tables[this.references[i].table].
	  selectWhere(fki);

	if (rr.length == 0) {
	  throw "Referencial integrity error on insert: " +
	    dbsimu.refAsString(this._name, 
			       this.references[i]) +
	    ". Row does not exist exist: " + dbsimu.datasAsString(fki);

	}
      }

      this._fire("after", "insert", null, data);
    } catch (ex) {
      if (row) {
	b.removeChild(row);
      }

      if (handler) {
	handler(this._name, ex);
      } else {
	throw ex; // signal get up
      }
    }
  },

  /**
   * Insert |data| without firing event.
   *
   * @param data
   */
  _insert: function(data) {
    var b = this._domElement.tBodies[0];
    var pki = this._primaryKey(data);
    var rr = this.selectWhere(pki);

    if (rr.length != 0) {
      var msg = "Duplicate primary key, " + this._name + "(";

      var k;
      var i = 0;
      for (k in pki) {
	if (i++ > 0) {
	  msg += ", ";
	}

	msg += k + "=" + pki[k];
      }

      msg += ")";

      throw msg;
    } 

    // ---

    var idx = b.rows.length;
    var row = b.insertRow(idx);

    var cell;
    var val;
    var n;
    for (i = 0; i < this._cols.length; i++) {
      n = this._cols[i];
      
      val = document.createTextNode(data[n]);
      cell = row.insertCell(-1);

      if (!data[n]) {
	cell.setAttribute("class", "isNull");
      }
      
      cell.appendChild(val);
    }

    var but = document.createElement("input");
    but.setAttribute("type", "button");
    but.setAttribute("value", "X");
    but.setAttribute("onclick", "dbsimu.deleteFrom(\"" +
		     this._name + "\", this)");
    
    cell = row.insertCell(-1);
    
    cell.appendChild(but);

    return row;
  },

  /**
   * Delete datas
   *
   * @param datas
   */
  deleteDatas: function(datas) {
    try {
      var i;
      var domRow;
      for (i = 0; i < datas.length; i++) {
	domRow = this._getDomElement(datas[i]);

	if (!domRow) {
	  continue;
	}
	
	this._delete(domRow, datas[i]);
      }
    } catch (ex) {
      window.alert("dbsimu[" + this._name + "]: " +
		   "An error has occured on delete: " + ex);
      
    }
  },
  
  /**
   * Delete data according row DOM element.
   *
   * @param domRow
   */
  deleteByRowElement: function(domRow) {
    var data = this._extractData(domRow);

    try {
      this._delete(domRow, data);
    } catch (ex) {
      window.alert("dbsimu[" + this._name + "]: " +
		   "An error has occured on delete: " + ex);
      
    }
  },

  /**
   * Delete from DOM row and matching data
   *
   * @param domRow
   * @param data
   */
  _delete: function(domRow, data) {
    var b = domRow.parentNode;

    try {
      this._fire("before", "delete", data, null);
      this._checkReferences("delete", data);
      
      b.removeChild(domRow);
      
      this._fire("after", "delete", data, null);
    } catch (ex) {
      // rollback
      b.appendChild(domRow);
      
      throw ex;
    }
  },

  /**
   * Select where columns match.
   *
   * @param whereClause "And" where clause
   */
  selectWhere: function(whereClause) {
    var results = new Array();

    if (!this._domElement) {
      // Table is uninitialized
      return results;
    }

    var b = this._domElement.tBodies[0];
    var rows = b.getElementsByTagName("tr");

    var data;
    var i;
    var c;
    var m;
    for (i = 0; i < rows.length; i++) {
      data = this._extractData(rows[i]);
      m = true;

      for (c in whereClause) {
	if (data[c] != whereClause[c]) {
	  m = false;
	  break;
	}
      }

      if (m && data) {
	results.push(data);
      }
    }

    return results;
  },

  // ---

  /**
   * Fire callback
   */
  _fire: function(when, what, oldRow, newRow) {
    var w = what.substring(0, 1).toUpperCase() +
    what.substring(1).toLowerCase();
    
    var n = "_" + when + w;
    var triggers = this[n];

    if (!triggers || triggers.length == 0) {
      return;
    }

    var i;
    for (i = 0; i < triggers.length; i++) {
      if (oldRow && newRow) {
	triggers[i](oldRow, newRow);
      } else if (!newRow) {
	triggers[i](oldRow);
      } else {
	triggers[i](newRow);
      }
    }
  },

  /**
   * Extract data from dom row
   */
  _extractData: function(domRow) {
    var cells = domRow.getElementsByTagName("td");
    var data = []

    var i;
    var n;
    var v;
    for (i = 0; i < this._cols.length; i++) {
      n = this._cols[i];
      v = cells[i].firstChild.nodeValue;

      data[n] = v;
    }

    return data;
  },

  /**
   * Get DOM element for data
   */
  _getDomElement: function(data) {
    var b = this._domElement.tBodies[0];
    var domRows = b.getElementsByTagName("tr");

    var i;
    var j;
    var v;
    var cells;
    var matches;
    for (i = 0; i < domRows.length; i++) {
      cells = domRows[i].getElementsByTagName("td");
      matches = true;

      for (j = 0; j < this._cols.length && matches; j++) {
	v = cells[j].firstChild.nodeValue;

	if (v != data[this._cols[j]]) {
	  matches = false;
	}
      }

      if (matches) {
	return domRows[i];
      }
    }

    return null;
  },

  /**
   * Get instance of defined primary key from |data|.
   *
   * @param data
   * @return Primary key instance
   */
  _primaryKey: function(data) {
    var pki = [];

    var i;
    var n;
    for (i = 0; i < this.primaryKey.length; i++) {
      n = this.primaryKey[i];

      pki[n] = data[n];
    }

    return pki;
  },

  /**
   * Get instance of defined foreign key from |data|.
   *
   * @param fkCols Name of foreign key local columns
   * @param data
   * @return Foreign key instance
   */
  _foreignKey: function(fkCols, data) {
    var fki = [];
    
    var f = false;
    var i;
    var n;
    for (i = 0; i < fkCols.length; i++) {
      n = fkCols[i];
      
      if (fki[n] = data[n]) {
	f = true;
      }
    }

    if (!f) {
      return null;
    }

    return fki;
  },

  /**
   * Turn foreign key form this table into key on referenced table.
   *
   * @param fkDecl Foreign key declaration
   * @param fki Foreign key instance of local table
   * @return Remote key matching |fki|, or null if none
   */
  _remoteKey: function(fkDecl, fki) {
    if (!fkDecl || !fki) {
      return null;
    }

    var key = { };

    var i;
    var lc;
    var rc;
    for (i = 0; i < fkDecl.localColumns.length; i++) {
      lc = fkDecl.localColumns[i];

      // Matching remote column
      rc = fkDecl.referencedColumns[i];

      key[rc] = fki[lc];
    }

    return key;
  },

  /**
   * Check foreign key references.
   *
   * @param what
   * @param data Concerned data
   */
  _checkReferences: function(what, data) {
    if (!this._inverseRef || this._inverseRef.length == 0) {
      return;
    }

    var n = "on" + what.substring(0, 1).toUpperCase() +
    what.substring(1).toLowerCase();

    var i;
    var cascadeAction;
    var tn;
    var t;
    var rr;
    var fk;
    for (i = 0; i < this._inverseRef.length; i++) {
      tn = this._inverseRef[i].table;
      t = dbsimu.tables[tn];
      fk = this._foreignKey(this._inverseRef[i].localColumns, data);

      if (!fk) {
	continue; // no foreign key
      }

      fk = this._remoteKey(this._inverseRef[i], fk);

      rr = t.selectWhere(fk);

      if (rr.length == 0) { // no referenced data
	continue; // no check to be done
      }

      // ---

      cascadeAction = this._inverseRef[i][n];

      if (cascadeAction == null) {
	throw "Referencial integrity error on " +
	  what + ": " + dbsimu.inverseRefAsString(this._name, 
						  this._inverseRef[i]) +
	  ". Row(s) still exist: " + dbsimu.datasAsString(rr);

      } else if (cascadeAction == "cascade") {
	t.deleteDatas(rr);
      }
    }
  }
};
