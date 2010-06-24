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
			if ($(event.target).parent().attr("id") === that.element.attr("id")) {
				that.dragging = { on:true, x:event.pageX, y:event.pageY };
				jQuery.log("Dragging from x, y: " + that.dragging.x + ", " + that.dragging.y);
			}
		});
		
		$(this.element).mousemove(function (event) {
			if(that.dragging.on) {
				var dX = event.pageX - that.dragging.x;
				var dY = event.pageY - that.dragging.y;
				jQuery.log("Dragging over x, y: " + event.pageX + ", " + event.pageY + " with dX, dY: " + dX + ", " + dY);
				that.offset(dX, dY);
				that.dragging.x = event.pageX;
				that.dragging.y = event.pageY;
			}
		});
		
		$(this.element).mouseup(function (event) {
			that.dragging.on = false;
			jQuery.log("No more dragging.");
		});
	}
}
jQuery.widget("ui.nodeMap", SKOOKUM.NodeMapProto);


SKOOKUM.NodeEditorProto = {
	options: {
		class_name: "node-editor",
	},
	edit_node: function(node) {
		this.node = node;
		target = $("#map").offset();
		target.top += node.y;				// TODO: Collapse these into one statement
		target.left += node.x;
		target.left -= this.element.innerWidth() * .5;
		target.top -= (this.element.innerHeight() + node.height * .5);
		target.top -= 5;
		this.element.show();
		this.element.css('top', target.top);
		this.element.css('left', target.left);
		var input = this.element.find("input").first();
		input.val(node.title);
		input.focus();
		input.select();
	},
	hide: function() {
		this.element.fadeOut(400);
	},
	_init: function() {
		var that = this;
		this.element.hide();
		this.node = null;
		$(document).bind('edit-node', function(event, node) {
			that.edit_node(node);
		});
		this.element.find("input").change(function(event) {
			that.node.set('title', $(this).val());
			that.hide();
		});
		this.element.find("input").blur(function(event) {
			//that.hide();
		});
		this.element.find("form").submit(function() {
			return false;
		});
	}
}
jQuery.widget("ui.nodeEditor", SKOOKUM.NodeEditorProto);



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
			roundedness = 10,
			bbox = null;
		this.clear();
		this.text = this.raph.text(this.x, this.y, this.title),
		bbox = this.text.getBBox(),
		this.width = bbox.width + (h_padding * 2),
		this.height = bbox.height + (v_padding * 2),
		this.rect = this.raph.rect(this.x - this.width * .5, this.y - this.height * .5, this.width, this.height, roundedness),
	
		this.rect.attr({ fill:'#ccc', stroke:'#bbb', 'stroke-width':2, cursor:'pointer' });
		this.text.attr({ fill:'#555', cursor:'pointer' });
		this.text.toFront();
		
		this.rect.click(this.activate);		// Is there any good reason to use $(this.rect.node).click() instead?
		this.text.click(this.activate);
	};
	this.move = function(x, y) {
		this.x += x;
		this.y += y;
		this.render();
	}
	this.activate = function(event) {
		that.rect.attr({ fill:'#ddd' });
		$(document).trigger('edit-node', [that]);	// A little cludgy
	};
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
