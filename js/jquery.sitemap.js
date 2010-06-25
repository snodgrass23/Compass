var SKOOKUM = SKOOKUM || {};

/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

SKOOKUM.NodeMapProto = {
	options: {
		class_name: "node-map"
	},
	add_node: function (title, x, y) {
		var node = this.raph.mapNode(title, x, y);
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
	/*build: function(data) {		// Develop a queue for breadth first processing
		var queue = [];
		var pointer = 0;
		for(var i in data) {
			queue.push(data[i]);
			data[i].parent = null;
		}
		while(pointer < queue.length) {
			for(var j in queue[pointer].children) {
				queue.push(queue[pointer].children[j]);
				queue[pointer].children[j].parent = queue[pointer];	// Also build links back to parents
			}
			pointer++;
		}
		for(var k in queue) {			// Check the order of processing, TODO: remove
			jQuery.log(queue[k].title);
		}
		
	},*/
	build: function(data, level) {
		if (data.length < 1) return;
		level = level || 0;
		var ox = 100;
		var oy = 100;
		for(var i in data) {
			$.log("Building " + data[i].title + " at level " + level + " with " + data[i].children.length + " children.");
			this.add_node(data[i].title, ox + i * 100, oy + level * 100);
			this.build(data[i].children, level + 1);
		}
	},
	_init: function () {	// I see some of the widgets using _create now... change necessary?
		var that = this;
		
		this.nodes = [];
		this.raph = Raphael(this.element.attr('id'), this.element.width(), this.element.height());
		this.element.data("node-map", this);
		this.ox = 0;
		this.oy = 0;
		this.dragging = { on:false, x:0, y:0 };
		
		jQuery.log("Setting up resize event...");
		$(window).resize(function (event) {
			jQuery.log("Resizing to " + $(that.element).innerWidth() + "x" + $(that.element).innerHeight());
			that.raph.setSize($(that.element).innerWidth(), $(that.element).innerHeight());
		});
	
		$(this.element).mousedown(function (event) {
			if ($(event.target).closest("div").data("node-map") === that) {		// Required since Chrome & FF treat parent() differently for SVG elements
				that.dragging = { on:true, x:event.pageX, y:event.pageY };
				jQuery.log("Dragging from x, y: " + that.dragging.x + ", " + that.dragging.y);
				document.onselectstart = function(){ return false; }	// Hack to display the proper cursor in Chrome
			}
		});
		
		$(this.element).mousemove(function (event) {
			if(that.dragging.on) {
				var dX = event.pageX - that.dragging.x;
				var dY = event.pageY - that.dragging.y;
				//jQuery.log("Dragging over x, y: " + event.pageX + ", " + event.pageY + " with dX, dY: " + dX + ", " + dY);
				that.offset(dX, dY);
				that.dragging.x = event.pageX;
				that.dragging.y = event.pageY;
			}
		});
		
		$(this.element).mouseup(function (event) {
			that.dragging.on = false;
			jQuery.log("No more dragging.");
			document.onselectstart = function(){ return true; }		// Cursor hack part II
		});
	}
}
jQuery.widget("ui.nodeMap", SKOOKUM.NodeMapProto);




SKOOKUM.NodeProto = function(raph, title, x, y) {
	var that = this;
	
	this.raph = raph;		// this.prototype = raph.el? That's how rect, circle, etc work...
	this.title = title;
	this.x = x;
	this.y = y;
	
	this.clear = function() {
		if(this.text) this.text.remove();
		if(this.rect) this.rect.remove();
	};
	this.render = function() {
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
	
		this.rect.attr({ fill:'#c7d3e0', stroke:'none', 'stroke-width':2, cursor:'pointer' });
		this.text.attr({ fill:'#555', cursor:'pointer' });
		this.text.toFront();
		
		this.rect.click(this.onClick);		// Is there any good reason to use $(this.rect.node).click() instead?
		this.text.click(this.onClick);
	};
	this.move = function(x, y) {
		this.x += x;
		this.y += y;
		this.rect.translate(x, y);
		this.text.translate(x, y);
	}
	this.onClick = function(event) {
		$(document).trigger('edit-node', [that]);	// A little cludgy
	};
	this.activate = function() {
		that.rect.attr({ fill:'#cfdae6' });
		that.text.attr({ fill:'#555' });
	}
	this.deactivate = function() {
		that.rect.attr({ fill:'#c7d3e0' });
		that.text.attr({ fill:'#555' });
	}
	this.set = function(prop, val) {
		that[prop] = val;
		if(prop === 'title') {
			that.render();
		}
	};
	
	this.render();
}

Raphael.fn.mapNode = function (title, x, y) {	
	return new SKOOKUM.NodeProto(this, title, x, y);		// Raphael.fn.* is called with apply() so "this" = the Raphael instance
}
