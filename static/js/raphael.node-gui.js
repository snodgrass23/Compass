/*
	Requires Raphael JS, skookum.jsutil.js
*/

SKOOKUM.SM = SKOOKUM.SM || {};

/*
	Constructor
*/
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
	
	this.rect = null;
	this.text = null;
	this.path = null;
		
	this.render();
	this.listen();
};

/*
	Methods
*/
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
		bbox = this.text.getBBox(),
		this.width = bbox.width + (h_padding * 2),
		this.height = bbox.height + (v_padding * 2),
		this.rect = this.raph.rect(this.x - this.width * .5, this.y - this.height * .5, this.width, this.height, roundedness),
	
		this.rect.attr({ fill:'#000', stroke:'none', 'stroke-width':2, cursor:'pointer' });
		this.text.attr({ fill:'#fff', cursor:'pointer' });
		this.text.toFront();

		var that = this;

		this.rect.click(function (event) {		// Must re-register listeners for newly created graphics objects
			that.request_focus();
		});
		this.text.click(function (event) {
			that.request_focus();
		});	

	};
	
	
	
	
	/* EVENTS
	 
	 	This is the primary method of communication between the loosely-coupled objects, so this is where most of the action happens	
	*/
		
	proto.listen = function () {
		var that = this;
		$(this.data).bind('update', function (event) {
			that.render();
			that.update();
		});
		$(this.data).bind('add-node', function(event, node) {		// Should creating new guis be handled here or in jquery.sitemap.js?
			SKOOKUM.log("add-node for " + node.title);
			$(that).trigger('add-node', [node, that]);
		});
		$(this.data).bind('delete-node', function(event) {
			that.clear();
			that.parent.children.splice(that.parent.children.indexOf(that), 1);
			$(document).trigger('delete-node-gui', [that]);
		});
	};
	proto.update = function () {
		$(this).trigger('update-node-gui', [this]);
	};
	proto.request_focus = function () {
		$(this).trigger('node-gui-focus', [this]);
	};
	
	
	
	
	proto.get_all_raph_objects = function() {
		var objs = [this.rect, this.text];
		this.path && objs.push(this.path);
		return objs;
	};	
	proto.move = function (dx, dy) {
		this.x += dx;
		this.y += dy;
		if(this.path) {
			this.raph.set(this.rect, this.text, this.path).translate(dx, dy);
		}
		else {
			this.raph.set(this.rect, this.text).translate(dx, dy);
		}
		/*
		this.raph.set(this.rect, this.text).translate(dx, dy);
		//this.rect.translate(dx, dy);
		//this.text.translate(dx, dy);
		this.path && this.path.translate(dx, dy);
		*/
	};
	proto.move_to = function (x, y) {
		var dx = x - this.x;
		var dy = y - this.y;
		this.move(dx, dy);
	};
	proto.apply_recursive_layout = function () {
		var active_layout = this.data.layout[this.ownerDocument.options.name] || this.data.layout[0];		// If no custom layout has been assigned to this node_gui for this view, use the node_gui's base layout
		active_layout.apply_to(this);	// Moves all direct children into place, draws path lines
		for (var i in this.children) {
			this.children[i].apply_recursive_layout();	// Pass it down the line
		}
	};
	proto.getPageCoords = function() {
		var offset = this.ownerDocument.element.offset();
		offset.left += this.x;
		offset.top += this.y;
		return offset;
	}
	proto.activate = function () {

	};
	proto.deactivate = function () {

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
	breadth_first = function() {
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
	proto.connection_box = function() {
		var box = {};
		if (true) { //(self.children.length == 0) {
			box.width = this.width;
			box.height = this.height;
			box.connect_top = 0;
			box.connect_bottom = this.height;
			box.connect_left = 0;
			box.connect_right = this.width;
		}
		return box;
	};
	proto.smart_deep_layout = function() {
		var gui_list = this.breadth_first();
		for (var i = 0; i < gui_list.length; i++) {
			var node_gui = gui_list[i];
			if (node_gui.children.length > 0) {
				node_gui.apply_layout();
			}
		}
	};
}) (SKOOKUM.SM.NodeGuiProto.prototype);



Raphael.fn.node_gui = function (data, x, y) {	
	return new SKOOKUM.SM.NodeGuiProto(this, data, x, y);		// Raphael.fn.* is called with apply() so "this" = the Raphael instance
};
