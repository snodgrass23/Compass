SKOOKUM.NodeProto = function(raph, title, x, y, data) {
	var that = this;
	
	this.raph = raph;		// this.prototype = raph.el? That's how rect, circle, etc work...
	this.title = title;
	this.x = x;
	this.y = y;
	this.data = data;
	this.rect = null;
	this.text = null;
	this.path = null;
	
	data.node = this;
		
	this.render();
	this.listen();
}

SKOOKUM.NodeProto.prototype.clear = function() {
	if(this.text) this.text.remove();
	if(this.rect) this.rect.remove();
};
SKOOKUM.NodeProto.prototype.render = function() {
	var h_padding = 20,
		v_padding = 10,
		roundedness = 3,
		bbox = null;
	this.clear();
	this.text = this.raph.text(this.x, this.y, this.title),
	bbox = this.text.getBBox(),
	this.width = bbox.width + (h_padding * 2),
	this.height = bbox.height + (v_padding * 2),
	this.rect = this.raph.rect(this.x - this.width * .5, this.y - this.height * .5, this.width, this.height, roundedness),

	this.rect.attr({ fill:'#000', stroke:'none', 'stroke-width':2, cursor:'pointer' });
	this.text.attr({ fill:'#fff', cursor:'pointer' });
	this.text.toFront();
};
SKOOKUM.NodeProto.prototype.listen = function() {
	var that = this;
	this.rect.click(function(event) {
		that.onClick(event);
	});
	this.text.click(function(event) {
		that.onClick(event);
	});
};
SKOOKUM.NodeProto.prototype.update = function() {
	$(document).trigger('update-node', this);
};
SKOOKUM.NodeProto.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;
	this.rect.translate(dx, dy);
	this.text.translate(dx, dy);
	if (this.path) {
		this.path.translate(dx, dy);
	}
};
SKOOKUM.NodeProto.prototype.moveTo = function(x, y) {
	var dx = x - this.x;
	var dy = y - this.y;
	this.move(dx, dy);
};
SKOOKUM.NodeProto.prototype.onClick = function(event) {
	$(document).trigger('edit-node', [this]);	// A little cludgy
};
SKOOKUM.NodeProto.prototype.activate = function() {
	/*that.rect.attr({ fill:'#cfdae6' });
	that.text.attr({ fill:'#555' });*/
	SKOOKUM.log("activate()");
};
SKOOKUM.NodeProto.prototype.deactivate = function() {
	/*
	that.rect.attr({ fill:'#c7d3e0' });
	that.text.attr({ fill:'#555' });*/
};
SKOOKUM.NodeProto.prototype.set = function(prop, val) {

	// Pre-updates
	if(prop === 'path') {
		if(this.path) {
			//jQuery.log(introspect("path", that.path));
			this.path.remove();
		}
		//jQuery.log("Setting path to " + val);
		this.path = val;
	}
	
	// Update
	this[prop] = val;
	
	// Post-updates
	if(prop === 'title') {
		this.render();
		$(document).trigger('update-node', [this]);
	}
};


Raphael.fn.mapNode = function (title, x, y, data) {	
	return new SKOOKUM.NodeProto(this, title, x, y, data);		// Raphael.fn.* is called with apply() so "this" = the Raphael instance
};
