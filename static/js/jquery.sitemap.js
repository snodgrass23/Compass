/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

SKOOKUM.SM = SKOOKUM.SM || {};

SKOOKUM.SM.SiteMapProto = {
	options: {
		name: "default",
		class_name: "site-map",
		ox: 320,					// TODO: Cleanup the offset stuff, it's really messy. DRY
		oy: 100,
		data: null
	},
	_create: function () {
		var that = this;
		
		this.raph = Raphael(this.element.attr('id'), this.element.width(), this.element.height());
		this.element.data("node-map", this);
				
		this.node_guis = [];
		this.off_x = 0;
		this.off_y = 0;
		
		this._create_event_listeners();		
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
	/**
	 * Build a sitemap from existing data
	 * @param data the SKOOKUM.SM.DataNode to use as the root for this sitemap
	 */
	build: function(data) {
		var root_gui;
		$(this.raph.canvas).empty();
		root_gui = this._add_gui_recursive(data);
		root_gui.move_to(this.element.parent().innerWidth() * .5, this.element.parent().innerHeight() * .5 - 50);
		root_gui.apply_recursive_layout();
	},
	offset: function (x, y) {
		for (var i in this.node_guis) {
			this.node_guis[i].move(x, y);
		}
	},
	zoom: function(zoom) {
		this.raph.setZoom(zoom);
	},
	get_svg: function() {
		return this.element.html();
	},
	_update_size: function() {
		this.raph.setSize($(this.element).innerWidth(), $(this.element).innerHeight());
	},
	_create_event_listeners: function () {
		var that = this;
		
		// Simulate an infinite canvas
		$(window).resize(function (event) {
			that._update_size();	
		});
		
		// Enable dragging around the artboard
		// TODO: Make the artboard stretch to always be exactly as large as the contents of the SVG,
		// rather than forcing the SVG to be huge when you're just scrolling around.
		var drag_update = null;
		var drag_options = null;
		if ($.browser.webkit) {			// webkit handles constant resizing very smoothly
			drag_options = {
				start: function(event, ui) {
					SKOOKUM.log(event.target);		// TODO: This isn't working, need to figure out why
					SKOOKUM.log("vs");
					SKOOKUM.log(that.element.get(0));
					if (event.target != that.element.get(0)) {
						return false;
					}
				},
				drag: function() {
					that._update_size();
				},
				stop: function() {
					var pos = that.element.position();
					that.offset(pos.left, pos.top);
					that.element.css({left: 0, top: 0});
					that._update_size();
				}
			};
		}
		else {							// sadly, FF doesn't
			drag_options = {
				start: function(event, ui) {
					// Implement something here that checks to make sure the event target is the sitemap div so button clicks etc don't
					// have a side-effect of triggering a drag as well
											SKOOKUM.log(event.target);
						SKOOKUM.log("vs");
						SKOOKUM.log(that.element.get(0));
					if (event.target != that.element.get(0)) {
						return false;
					}
					drag_update = window.setInterval(function() {
						that._update_size();
					}, 400);
				},
				stop: function(event, ui) {
					window.clearInterval(drag_update);
					var pos = that.element.position();
					that.offset(pos.left, pos.top);
					that.element.css({left: 0, top: 0});
					that._update_size();
				}
			}
		}
		$(this.element).draggable(drag_options);		// TODO: This seems to break the blur event for the node editor from background clicks. Fix that.
		
		$(this).bind('update-node-gui', function(event, node_gui) {
			SKOOKUM.log("update-node-gui for " + node_gui.data.title);
			node_gui.parent.apply_recursive_layout();
			//that._layout(node_gui.parent);
		});
		
		$(this).bind('add-node', function(event, new_node, parent_gui) {
			SKOOKUM.log("add-node for " + new_node.title);
			var new_gui = that._add_gui(new_node, parent_gui);
			//that._layout(parent_gui);
			parent_gui.apply_recursive_layout();
			$(document).trigger('added-node-gui', [new_gui, that]);
		});
		
		$(this).bind('node-gui-focus', function(event, node_gui) {
			$(document).trigger('edit-node-gui', [node_gui]);
		});
		
		$(document).bind('delete-node-gui', function(event, node_gui) {
			that._remove_gui(node_gui);
			SKOOKUM.log("updating layout for " + node_gui.parent.data.title);
			//that._layout(node_gui.parent);
			node_gui.parent.apply_recursive_layout();
		})
	}
}
jQuery.widget("ui.siteMap", SKOOKUM.SM.SiteMapProto);