
//	Requires Raphael JS, skookum.jsutil.js

SKOOKUM.SM = SKOOKUM.SM || {};


// Constructor

SKOOKUM.SM.NodeGuiProto = function (raph, data, x, y) {
	var that = this;
	
	this.raph = raph;		// this.prototype = raph.el? That's how rect, circle, etc work...
	this.data = data;
	this.parent = null;
	this.children = [];
	this.ownerDocument = null;	// The SKOOKUM.SM.SiteMapProto instance this is attached to. Also for jQuery custom event bubbling
	
	this.x = x || 0;
	this.y = y || 0;
	this.width = 0;
	this.height = 0;
	this.box = {};		// Connection box
	
	this.rect = null;
	this.text = null;
	this.path = null;
		
	this.render();
	this.listen();
};


// Methods

(function (proto) {

	proto.clear = function () {
		if (this.text) this.text.remove();
		if (this.rect) this.rect.remove();
		if (this.path) this.path.remove();
	};
	
	proto.render = function () {
		if (!this.data) return;
		var h_padding = 20,
			v_padding = 10,
			roundedness = 3,
			bbox = null;
			
		this.clear();
		this.text = this.raph.text(this.x, this.y, this.data.title),
		this.text.attr({ fill:'#fff', cursor:'pointer' });
				
		bbox = this.text.getBBox(),
		this.width = bbox.width + (h_padding * 2),
		this.height = bbox.height + (v_padding * 2),
		
		this.rect = this.raph.rect(this.x - this.width * .5, this.y - this.height * .5, this.width, this.height, roundedness),
		this.rect.attr({ fill:'#000', stroke:'none', 'stroke-width':2, cursor:'pointer' });
		this.text.toFront();

		var that = this;

		this.rect.click(function (event) {		// Must re-register listeners for newly created graphics objects
			$(that).trigger('node-gui-focus', [that]);
			event.stopPropagation();
			return false;
		});
		this.text.click(function (event) {
			$(that).trigger('node-gui-focus', [that]);
			event.stopPropagation();
			return false;
		});	
	};
	
	proto.listen = function () {
		var that = this;
		
		$(this.data).bind('update', function (event) {
			that.render();
			$(that).trigger('update-node-gui', [this]);
		});
		
		$(this.data).bind('add-node', function(event, node) {		// Should creating new guis be handled here or in jquery.sitemap.js?
			$(that).trigger('add-node', [node, that]);
		});
		
		$(this.data).bind('delete-node', function(event) {
			that.clear();
			that.parent.children.splice(that.parent.children.indexOf(that), 1);
			$(that).trigger('delete-node-gui', [that]);
		});
	};
	
	proto.trigger_moved = function() {
		this.debug_box();
		$(this).trigger('moved-node-gui', [this]);
	};
	
	proto.move = function (dx, dy) {
		SKOOKUM.log("Moving " + this.data.title);
		this.x += dx;
		this.y += dy;
		
		if(this.path) {
			this.raph.set(this.rect, this.text, this.path).translate(dx, dy);
		}
		else {
			this.raph.set(this.rect, this.text).translate(dx, dy);
		}
		this.trigger_moved();
	};
	
	proto.move_with_children = function (dx, dy) {
		this.move(dx, dy);
		for (var i in this.children) {
			this.children[i].move_with_children(dx, dy);
		}
	};
	
	proto.move_to = function (x, y) {
		var dx = x - this.x;
		var dy = y - this.y;
		this.move(dx, dy);
	};
	
	proto.move_to_with_children = function (x, y) {
		var dx = x - this.x;
		var dy = y - this.y;
		this.trigger_moved();
		this.move_with_children(dx, dy);
	};
	
	proto.get_page_coords = function() {
		var offset = this.ownerDocument.raph_wrap.offset();
		offset.left += this.x;
		offset.top += this.y;
		return offset;
	};

	proto.set_path = function(path) {
		if (this.path) {
			this.path.remove();
		}	
		this.path = path;
	};
	
	proto.set_path_str = function(str) {
		if (this.path) {
			this.path.remove();
		}
		this.path = this.raph.path(str);
	};
	
	proto.is_root = function() {
		return !this.parent;
	}
	
	proto.debug_box = function() {
		//return;
		this.debug_rect && this.debug_rect.remove();
		var my_box = this.get_box();
		this.debug_rect = this.raph.rect(my_box.left, my_box.top, my_box.width, my_box.height);
		if (this.is_root()) {
			this.debug_rect.attr({stroke: 'green', 'stroke-width': 3});
		}
		else if (this.children.length == 0) {
			this.debug_rect.attr({stroke: 'red', 'stroke-width': 3});
		}
		else {
			this.debug_rect.attr({stroke: 'blue', 'stroke-width': 3});
		}
	}
	
	proto.breadth_first = function() {
		var queue = [this],
			bf_array = [],
			gui;
		do {
			gui = queue.shift();
			bf_array.push(gui);
			for (var i in gui.children) {
				queue.push(gui.children[i]);
			}
		} while (queue.length > 0);
		return bf_array;
	};
	
	// Returns the bounding box of this node + descendents
	// Results are meaningless unless descendents have already been positioned according to their apply_layout() function
	proto.get_box = function() {				// This is probably super inefficient. Making all these calculations each time could probably be done better; but this works for now.
		var box = {};
		box.top = this.top();
		box.bottom = this.bottom();
		box.left = this.left();
		box.right = this.right();
		for (var i in this.children) {
			var child_box = this.children[i].get_box();
			box.left = (child_box.left < box.left) ? child_box.left : box.left;
			box.right = (child_box.right > box.right) ? child_box.right : box.right;
			box.top = (child_box.top < box.top) ? child_box.top : box.top;
			box.bottom = (child_box.bottom > box.bottom) ? child_box.bottom : box.bottom;
		}
		box.width = box.right - box.left;
		box.height = box.bottom - box.top;
		box.p_top = this.top() - box.top;				// Padding, crucial for positioning
		box.p_bottom = box.bottom - this.bottom();
		box.p_left = this.left() - box.left;
		box.p_right = box.right - this.right();
		return box;
	};
	
	proto.top = function() {
		return this.y - this.height * .5;
	}
	
	proto.bottom = function() {
		return this.y + this.height * .5;
	}
	
	proto.left = function() {
		return this.x - this.width * .5;
	}
	
	proto.right = function() {
		return this.x + this.width * .5;
	}
	
	proto.apply_layout = function () {
		var active_layout = this.data.layout[this.ownerDocument.options.name] || this.data.layout[0];		// If no custom layout has been assigned to this node_gui for this view, use the node_gui's base layout
		active_layout.apply_to(this);
	};
	
}) (SKOOKUM.SM.NodeGuiProto.prototype);



Raphael.fn.node_gui = function (data, x, y) {	
	return new SKOOKUM.SM.NodeGuiProto(this, data, x, y);		// Raphael.fn.* is called with apply() so "this" = the Raphael instance
};
