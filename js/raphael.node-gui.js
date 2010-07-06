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
	this.x = x || 0;
	this.y = y || 0;
	
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
			that.onClick(event);
		});
		this.text.click(function (event) {
			that.onClick(event);
		});		

	};
	proto.listen = function () {
		var that = this;
		$(this.data).bind('update', function (event) {
			that.render();
			that.update();
		});
		$(this.data).bind('add-node', function(event, node) {		// Should creating new guis be handled here or in jquery.sitemap.js?
			SKOOKUM.log("add-node for " + node.title);
			$(document).trigger('add-node-gui', [node, that]);
		});
		$(this.data).bind('delete-node', function(event) {
			that.clear();
			that.parent.children.splice(that.parent.children.indexOf(that), 1);
			$(document).trigger('delete-node-gui', [that]);
		});
	};
	proto.update = function () {
		$(document).trigger('update-node-gui', [this]);
	};
	proto.move = function (dx, dy) {
		this.x += dx;
		this.y += dy;
		this.rect.translate(dx, dy);
		this.text.translate(dx, dy);
		if (this.path) {
			this.path.translate(dx, dy);
		}
	};
	proto.moveTo = function (x, y) {
		var dx = x - this.x;
		var dy = y - this.y;
		this.move(dx, dy);
	};
	proto.onClick = function (event) {
		$(document).trigger('edit-node', [this]);
	};
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
}) (SKOOKUM.SM.NodeGuiProto.prototype);



Raphael.fn.node_gui = function (data, x, y) {	
	return new SKOOKUM.SM.NodeGuiProto(this, data, x, y);		// Raphael.fn.* is called with apply() so "this" = the Raphael instance
};
