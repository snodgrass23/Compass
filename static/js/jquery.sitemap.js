/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

SKOOKUM.SM = SKOOKUM.SM || {};


// EVENTS
// Broadcasts (bubbling): edit-node-gui
// Handles (bubbling): update-node-gui, add-node, node-gui-focus, delete-node-gui

SKOOKUM.SM.SiteMapProto = {

	options: {
		name: "default",
		class_name: "site-map"		// TODO: Add "data" as an option, so you can just say siteMap('option', 'data', newdata)
	},
	
	_create: function () {
		var that = this;
		this.raph = Raphael(this.element.attr('id'), this.element.width(), this.element.height());
		this.element.data("node-map", this);
		this.ownerDocument = document;
		
		this.clear();
		this._create_dragging();
		this._create_event_listeners();	
	},	
	
	_add_gui: function(data, parent_gui) {
		SKOOKUM.log("_add_gui()");
		var gui = this.raph.node_gui(data);
		gui.parent = parent_gui;
		gui.ownerDocument = this;			// To enable jQuery event "bubbling" on non-DOM objects

		parent_gui.children.push(gui);
		this.node_guis.push(gui);

		return gui;
	},
	
	_add_gui_recursive: function (data, parent) {
		var gui = this.raph.node_gui(data);
		gui.parent = parent || null;
		gui.ownerDocument = this;		// To enable jQuery event "bubbling" on non-DOM objects
		
		if (!parent) {
			gui.clear();
		}

		if (data.children) {
			for (var i in data.children) {
				var new_child = this._add_gui_recursive (data.children[i], gui);
				gui.children.push(new_child);
			}
		}

		this.node_guis.push(gui);
		return gui;
	},
	
	_remove_gui: function (node_gui) {
		this.node_guis.splice(this.node_guis.indexOf(node_gui), 1);
		return node_gui;
	},
	
	_layout_guis_smart_deep: function () {
		SKOOKUM.log("Smart, deep layout!");
		var gui_list = this.root_gui.breadth_first().reverse();
		var titles = "";
		for (var i = 0; i < gui_list.length; i++) {
			titles += gui_list[i].data.title + ", ";
			gui_list[i].apply_layout();
		}
		SKOOKUM.log(titles);
	},
	
	_update_size: function() {
		this.raph.setSize($(this.element).innerWidth(), $(this.element).innerHeight());
		$(this).trigger("resize");
	},
	
	_create_event_listeners: function () {
		var that = this;
		
		$(window).resize(function (event) {				// Simulate an infinite canvas
			that._update_size();	
		});
		
		$(this).bind('update-node-gui', function(event, node_gui) {
			this._layout_guis_smart_deep();
		});
		
		$(this).bind('add-node', function(event, new_node, parent_gui) {
			var new_gui = that._add_gui(new_node, parent_gui);
			this._layout_guis_smart_deep();
			$(this).trigger('added-node-gui', [new_gui, this]);
		});
		
		$(this).bind('node-gui-focus', function(event, node_gui) {
			$(this).trigger('edit-node-gui', [node_gui]);
		});
		
		$(this).bind('delete-node-gui', function(event, node_gui) {
			this._remove_gui(node_gui);
			this._layout_guis_smart_deep();
		})
	},
	
	_create_dragging: function() {
		var that = this;
		// Enable dragging around the artboard
		// TODO: Make the artboard stretch to always be exactly as large as the contents of the SVG,
		// rather than forcing the SVG to be huge when you're just scrolling around.
		var drag_update = null;
		var drag_options = null;
		if ($.browser.webkit) {			// webkit handles constant resizing very smoothly
			drag_options = {
				start: function(event, ui) {
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
	},

	// Build a sitemap from existing data
	build: function(data) {
		this.clear();
		this.root_gui = this._add_gui_recursive(data);
		this.root_gui.move_to(this.element.parent().innerWidth() * .5, this.element.parent().innerHeight() * .5 - 50);
		this._layout_guis_smart_deep();
	},
	
	// Reset to zero-state
	clear: function() {
		$(this.raph.canvas).empty();
		this.node_guis = [];
		this.root_gui = null;
		this.off_x = 0;
		this.off_y = 0;
	},
	
	// Move each node in the Raphael canvas
	offset: function (x, y) {
		for (var i in this.node_guis) {			// TODO compare this syntax to standard Array looping syntax
			this.node_guis[i].move(x, y);
		}
	},
	
	// Experimental - needs work
	zoom: function(zoom) {
		this.raph.setZoom(zoom);
	},
	
	// Returns the DOMs SVG element as a string
	get_svg: function() {
		return this.element.html();
	}
	
}
jQuery.widget("ui.siteMap", SKOOKUM.SM.SiteMapProto);