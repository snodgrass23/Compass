/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

SKOOKUM.SM = SKOOKUM.SM || {};

SKOOKUM.SM.SiteMapProto = {
	options: {
		class_name: "site-map",
		ox: 320,					// TODO: Cleanup the offset stuff, it's really messy. DRY
		oy: 100,
		data: null
	},
	_add_gui: function(data, parent_gui) {
		var gui = this.raph.node_gui(data);
		gui.parent = parent_gui;
		parent_gui.children.push(gui);
		gui.ownerDocument = this;			// To enable jQuery event "bubbling" on non-DOM objects
		this.node_guis.push(gui);
		return gui;
	},
	_add_gui_recursive: function (data, parent) {
		var gui = this.raph.node_gui(data);
		gui.parent = parent || null;
		if (!parent) {
			gui.clear();
		}
		if (data.children) {
			for (var i in data.children) {
				var new_child = this._add_gui_recursive (data.children[i], gui);
				gui.children.push(new_child);
			}
		}
		gui.ownerDocument = this;		// To enable jQuery event "bubbling" on non-DOM objects
		this.node_guis.push(gui);
		return gui;
	},
	_remove_gui: function(node_gui) {
		this.node_guis.splice(this.node_guis.indexOf(node_gui), 1);
	},
	offset: function (x, y) {
		for (var i in this.node_guis) {
			this.node_guis[i].move(x, y);
		}
		this.ox += x;
		this.oy += y;
	},
	/**
	 * Build a sitemap from existing data
	 * @param data the SKOOKUM.SM.DataNode to use as the root for this sitemap
	 */
	build: function(data) {		// Develop a queue for breadth first processing TODO: no longer necessary with the new layout model =(
		SKOOKUM.log("Building for data " + data);
		$(this.raph.canvas).empty();
		//this.data = data;

		var root_gui = this._add_gui_recursive(data);

		// Position all of the nodes
		this._layout(root_gui);
	},
	_layout: function(node_gui, x, y) {
		if (typeof(node_gui.data) == "undefined") {
			SKOOKUM.log(SKOOKUM.introspect(node_gui));
		}
		//SKOOKUM.log("Layout for " + node_gui.data.title);
		var i = null,
			parent_height = 0,
			data = node_gui.data;
		
		// Root node should be positioned at the origin (ox, oy)
		if (!data.parent) {
			x = this.options.ox;	// TODO: Unnecessary since ox/oy should remain 0, 0?
			y = this.options.oy;
		}
		
		// Sometimes we're just refreshing child nodes, so we want to keep the current position
		x = x || node_gui.x;
		y = y || node_gui.y;
		
		// Position the node at x, y (or at the origin x and y for the root node)
		if (data.parent) {
			node_gui.moveTo(x, y);				// Only non-root data items have "node" elements for display
			parent_height = node_gui.height;
		}
		
		// Recursively calculate positions for child nodes
		if (node_gui.children.length === 0) {
			return;
		}
		if (data.layout.type === 'branch') {
			var child_y = y + parent_height * .5;
			var total_width = 0;
			var split_y = child_y + data.layout.size;
			var path = "M " + x + " " + (child_y) + " L " + x + " " + split_y + " " ;
			child_y += data.layout.size * 2;
			for (i in node_gui.children) {
				total_width += node_gui.children[i].width;
			}
			total_width += ( data.layout.spacing * (node_gui.children.length - 1) );
			var child_x = x - total_width * .5; // - total_width * .5;
			for (i in node_gui.children) {
				child_x = child_x + (node_gui.children[i].width * .5);
				path += "M " + child_x + " " + split_y + " ";
				path += "L " + child_x + " " + (split_y + data.layout.size) + " ";
				this._layout(node_gui.children[i], child_x, child_y + (node_gui.children[i].height * .5));
				child_x = child_x + (node_gui.children[i].width * .5) + data.layout.spacing;
			}
			if(node_gui.children.length > 1) {
				var node1 = node_gui.children[0];
				var node2 = node_gui.children[data.children.length - 1];
				path += "M " + node1.x + " " + split_y + " ";
				path += "L " + node2.x + " " + split_y + " ";
			}			
			if(data.parent) {
				//SKOOKUM.log("Path is " + path);
				node_gui.set_path(this.raph.path(path));	// TODO: Clean up!
			}
		}
	},
	_create: function () {
		var that = this;
		
		this.raph = Raphael(this.element.attr('id'), this.element.width(), this.element.height());
		this.element.data("node-map", this);
				
		this.node_guis = [];
		this.off_x = 0;
		this.off_y = 0;
		this.dragging = { on:false, x:0, y:0 };
		
		this._create_event_listeners();		
	},
	_onDrag: function(x, y) {
		if(this.dragging.on) {
			var dX = x - this.dragging.x;
			var dY = y - this.dragging.y;
			this.offset(dX, dY);
			this.dragging.x = x;
			this.dragging.y = y;
		}
	},
	_create_event_listeners: function () {
		var that = this;
		
		// Simulate an infinite canvas
		$(window).resize(function (event) {
			that.raph.setSize($(that.element).innerWidth(), $(that.element).innerHeight());
		});
	
		// Dragging on the "artboard"
		$(this.element).mousedown(function (event) {
			if ($(event.target).closest("div").data("node-map") === that) {		// Required since Chrome & FF treat parent() differently for SVG elements
				that.dragging = { on:true, x:event.pageX, y:event.pageY };
				document.onselectstart = function(){ return false; }			// Hack to display the proper cursor in Chrome
				$(document).mousemove(function (event) {
					that._onDrag(event.pageX, event.pageY);
				});
				$(document).bind('mouseup mouseleave', function(event) {
					$(document).unbind('mouseup mouseleave');				// This could have side-effects! TODO: make more elegant?
					that.dragging.on = false;
					document.onselectstart = function(){ return true; }		// Cursor hack part II
				});
			}
		});
		
		$(this.element).mouseup(function (event) {
			that.dragging.on = false;
			document.onselectstart = function(){ return true; }		// Cursor hack part II
		});
		
		// Refresh the display when any node is updated
		// TODO: Modify these global event listeners to scope only to node_guis within this sitemap instance
		// (how? Good question... bad answer is a loop iterating through node_guis[] and comparing)
		$(this).bind('update-node-gui', function(event, node_gui) {
			SKOOKUM.log("update-node-gui for " + node_gui.data.title);
			that._layout(node_gui.parent);
		});
		
		$(this).bind('add-node', function(event, new_node, parent_gui) {
			SKOOKUM.log("add-node for " + new_node.title);
			var new_gui = that._add_gui(new_node, parent_gui);
			that._layout(parent_gui);
			$(document).trigger('added-node-gui', [new_gui, that]);
		});
		
		$(this).bind('node-gui-focus', function(event, node_gui) {
			$(document).trigger('edit-node-gui', [node_gui]);
		});
		
		$(document).bind('delete-node-gui', function(event, node_gui) {
			that._remove_gui(node_gui);
			SKOOKUM.log("updating layout for " + node_gui.parent.data.title);
			that._layout(node_gui.parent);
		})
	}
}
jQuery.widget("ui.siteMap", SKOOKUM.SM.SiteMapProto);