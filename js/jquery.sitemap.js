var SKOOKUM = SKOOKUM || {};

/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

var done = 0;

SKOOKUM.SiteMapProto = {
	options: {
		class_name: "site-map",
		ox: 320,
		oy: 100,
		data: null
	},
	default_layout: {
		type: 'branch',
		size: 10,
		spacing: 10,
		direction: 'down'
	},
	add_node: function (title, x, y, data) {
		var node = this.raph.mapNode(title, x, y, data);
		this.nodes.push(node);
		return node;
	},
	offset: function (x, y) {
		for (var i in this.nodes) {
			this.nodes[i].move(x, y);
		}
		this.ox += x;
		this.oy += y;
	},
	build: function(data) {		// Develop a queue for breadth first processing TODO: no longer necessary with the new layout model =(
		jQuery.log("Building from data: " + data);
		$(this.raph.canvas).empty();
		this.data = data;
		var queue = [];
		var pointer = 0;
		var i = null;
		data.layout = this.default_layout;	// Set the layout for root(hidden)->first level nodes
		
		// Drop in all immediate children
		data.parent = null;
		for (i in data.children) {
			jQuery.log("Pushing child " + i + " into queue...");
			queue.push(data.children[i]);
			data.children[i].layout = data.children[i].layout || this.default_layout;
			data.children[i].parent = data;
		}
		
		// Add all of the deeper-than-1st-level children to the breadth first queue
		while (pointer < queue.length) {
			jQuery.log("Processing children of queue item #" + pointer);
			for (i in queue[pointer].children) {
				queue.push(queue[pointer].children[i]);
				queue[pointer].children[i].layout = queue[pointer].children[i].layout || this.default_layout;	// Add default layouts
				queue[pointer].children[i].parent = queue[pointer];	// Also build links back to parents
			}
			pointer++;
		}
		
		// Create all of these nodes in BF order
		for (i in queue) {
			this.add_node(queue[i].title, 0, 0, queue[i]);
		}
		
		// Position all of the nodes
		this._layout(this.data);
	},
	_layout: function(data, x, y) {
		//jQuery.log("Layout for " + data.title + " at " + x + ", " + y);
		var i = null,
			parent_height = 0;
		
		// Root node should be positioned at the origin (ox, oy)
		if (!data.parent) {
			x = this.options.ox;
			y = this.options.oy;
		}
		
		// Sometimes we're just refreshing child nodes, so we want to keep the current position
		x = x || data.node.x;
		y = y || data.node.y;
		
		// Position the node at x, y (or at the origin x and y for the root node)
		if (data.parent) {
			data.node.moveTo(x, y);				// Only non-root data items have "node" elements for display
			parent_height = data.node.height;
		}
		
		// Recursively calculate positions for child nodes
		if (data.children.length === 0) {
			return;
		}
		if (data.layout.type === 'branch') {
			var child_y = y + parent_height * .5;
			var total_width = 0;
			var split_y = child_y + data.layout.size;
			var path = "M " + x + " " + (child_y) + " L " + x + " " + split_y + " " ;
			child_y += data.layout.size * 2;
			for (i in data.children) {
				total_width += data.children[i].node.width;
			}
			total_width += ( data.layout.spacing * (data.children.length - 1) );
			var child_x = x - total_width * .5; // - total_width * .5;
			for (i in data.children) {
				child_x = child_x + (data.children[i].node.width * .5);
				path += "M " + child_x + " " + split_y + " ";
				path += "L " + child_x + " " + (split_y + data.layout.size) + " ";
				this._layout(data.children[i], child_x, child_y + (data.children[i].node.height * .5));
				child_x = child_x + (data.children[i].node.width * .5) + data.layout.spacing;
			}
			if(data.children.length > 1) {
				var node1 = data.children[0].node;
				var node2 = data.children[data.children.length - 1].node;
				path += "M " + node1.x + " " + split_y + " ";
				path += "L " + node2.x + " " + split_y + " ";
			}			
			if(data.parent) {
				jQuery.log("Path is " + path);
				data.node.set('path', this.raph.path(path));
			}
		}
	},
	_create: function () {
		var that = this;
		
		this.nodes = [];
		this.raph = Raphael(this.element.attr('id'), this.element.width(), this.element.height());
		this.element.data("node-map", this);
		this.ox = 0;
		this.oy = 0;
		this.dragging = { on:false, x:0, y:0 };
		
		// Simulate an infinite canvas
		$(window).resize(function (event) {
			that.raph.setSize($(that.element).innerWidth(), $(that.element).innerHeight());
		});
	
		// Dragging on the "artboard"
		$(this.element).mousedown(function (event) {
			if ($(event.target).closest("div").data("node-map") === that) {		// Required since Chrome & FF treat parent() differently for SVG elements
				that.dragging = { on:true, x:event.pageX, y:event.pageY };
				document.onselectstart = function(){ return false; }			// Hack to display the proper cursor in Chrome
			}
		});
		$(this.element).mousemove(function (event) {
			if(that.dragging.on) {
				var dX = event.pageX - that.dragging.x;
				var dY = event.pageY - that.dragging.y;
				that.offset(dX, dY);
				that.dragging.x = event.pageX;
				that.dragging.y = event.pageY;
			}
		});
		$(this.element).mouseup(function (event) {
			that.dragging.on = false;
			document.onselectstart = function(){ return true; }		// Cursor hack part II
		});
		
		// Refresh the display when any node is updated
		$(document).bind('update-node', function(event, node) {
			that._layout(node.data.parent);
		});
	}
}
jQuery.widget("ui.siteMap", SKOOKUM.SiteMapProto);