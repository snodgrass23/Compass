/*
	Requires Raphael, jQuery, the jQuery UI Widget Factory, skookum.jsutil.js
*/

SKOOKUM.SM = SKOOKUM.SM || {};


// EVENTS
// Broadcasts (bubbling): edit-node-gui
// Handles (bubbling): update-node-gui, add-node, node-gui-focus, delete-node-gui

SKOOKUM.SM.SitemapProto = {

	options: {
		name: "default"
		, class_name: "site-map"		// TODO: Add "data" as an option, so you can just say siteMap('option', 'data', newdata)
		, in_view_margins: .3
	},
	
	_create: function () {
		var that = this;
		
		this.element.addClass('sitemap');					// "#map-container
		this.raph_wrap = $('<div class="raph" style="border: solid 1px red"></div>');		// .raph ui-draggable
		this.element.append(this.raph_wrap);
		this.raph = Raphael(this.raph_wrap.get(0), this.element.width(), this.element.height());
		this.ownerDocument = document;
		
		this.target = {x: 0, y: 0};
		
		this.clear();
		this._create_dragging();
		this._create_event_listeners();	
	},	
	
	_add_gui: function(data, parent_gui) {
		SKOOKUM.log("_add_gui()");
		var gui = this.raph.node_gui(data, parent_gui, this);
//		gui.parent = parent_gui;
//		gui.ownerDocument = this;			// To enable jQuery event "bubbling" on non-DOM objects

//		parent_gui.children.push(gui);
		this.node_guis.push(gui);

		return gui;
	},
	
	_add_gui_recursive: function (data, parent) {
		var gui = this.raph.node_gui(data, parent, this);
//		gui.parent = parent || null;
//		gui.ownerDocument = this;		// To enable jQuery event "bubbling" on non-DOM objects
		
		/*if (!parent) {
			gui.clear();
		}*/

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
		this._center_target();
		SKOOKUM.log(titles);
	},
	
	_update_size: function() {
		this.raph.setSize($(this.raph_wrap).innerWidth(), $(this.raph_wrap).innerHeight());
		$(this).trigger("resize");
	},
	
	_center_target: function() {
	   SKOOKUM.log("_center_target()");
		var box = this.root_gui.get_box();
		var view_width = $(this.raph_wrap).innerWidth();
		var view_height = $(this.raph_wrap).innerHeight();
		var dx = (this.target.x + (view_width - box.width) * .5) - box.left;
		var dy = (this.target.y + (view_height - box.height) * .5) - box.top;
		this.offset(dx, dy);
	},
	
	_create_event_listeners: function () {
		var that = this;
		
		$(window).resize(function (event) {				// Simulate an infinite canvas
			that._update_size();
			that._center_target();						
		});
		
		$(this).bind('update-node-gui', function(event, node_gui) {
			this._layout_guis_smart_deep();
		});
		
		$(this).bind('add-node', function(event, new_node, parent_gui) {
			var new_gui = that._add_gui(new_node, parent_gui);
			this._layout_guis_smart_deep();
			$(this).trigger('added-node-gui', [new_gui, this]);
      this._keep_in_view(new_gui);
		});
		
		$(this).bind('node-gui-focus', function(event, node_gui) {
			$(this).trigger('edit-node-gui', [node_gui]);
			this._keep_in_view(node_gui);
		});
		
		$(this).bind('delete-node-gui', function(event, node_gui) {
			var to_parent = node_gui.parent;
			this._remove_gui(node_gui);
			this._layout_guis_smart_deep();
			$(this).trigger('deleted-node-gui', [node_gui]);
			$(this).trigger('edit-node-gui', [to_parent]);
		})
		
		$(this.raph_wrap).click(function(event) {
			$(that).trigger('edit-node-gui', [null]);
		});
	},
	
	_keep_in_view: function(node_gui) {
	   var view_width = $(this.raph_wrap).innerWidth();
	   var view_height = $(this.raph_wrap).innerHeight();
	   var px = node_gui.x / view_width;
	   var py = node_gui.y / view_height;
	   var dx = dy = 0;
	   console.log(px + ", " + py);
      if (px > 1 - this.options.in_view_margins) {
        dx = px - (1 - this.options.in_view_margins);
      }
      else if (px < this.options.in_view_margins) {
        dx = px - this.options.in_view_margins;
      }
      if (py > 1 - this.options.in_view_margins) {
        dy = py - (1 - this.options.in_view_margins);
      }
      else if (py < this.options.in_view_margins) {
        dy = py - this.options.in_view_margins;
      }
      dx *= view_width;
      dy *= view_height;
      this.target.x -= dx;
      this.target.y -= dy;
      this._center_target();
	},
	
	_create_dragging: function() {
		var that = this;
		// Enable dragging around the artboard
		var drag_options = {
				start: function(event, ui) {				// Hack to make both gecko and webkit recognize the real "original target"
					if (event.originalEvent.target !== that.raph_wrap[0] && event.originalEvent.target.parentNode !== that.raph_wrap[0]) {
						return false;
					}
					$(that).trigger("drag");
				},
				drag: function() {
					that._update_size();
				},
				stop: function() {
					var pos = that.raph_wrap.position();
					that.target.x += pos.left;
					that.target.y += pos.top;					
					//that.offset(pos.left, pos.top);
					that.raph_wrap.css({left: 0, top: 0});
					that._update_size();
					that._center_target();					
				}
			};
		$(this.raph_wrap).draggable(drag_options);
	},

	// Build a sitemap from existing data
	build: function(data) {
		this.clear();
		this.root_gui = this._add_gui_recursive(data);
		//this.root_gui.move_to(this.element.innerWidth() * .5, this.element.innerHeight() * .5 - 50);
		this._layout_guis_smart_deep();
	},
	
	// Reset to zero-state
	clear: function() {
		$(this.raph.canvas).empty();
		this.node_guis = [];
		this.root_gui = null;
		this.off_x = 0;				// TODO: Cleanup or integrate with target.x/.y
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
		return this.raph_wrap.html();
	},
	
	_next_gui_at_angle: function(node_gui, target_angle) {
		var filtered = [],
			i,
			distance;
		for (i in this.node_guis) {
			var test_gui = this.node_guis[i];
			if (test_gui !== node_gui) {
				var angle = Math.atan2( (test_gui.y - node_gui.y), (test_gui.x - node_gui.x) );
				if (angle < 0) {
					angle += (Math.PI * 2);
				}
				distance = Math.abs(target_angle - angle);
				if (distance < Math.PI * .45) {
					//SKOOKUM.log("Good angle = " + angle + "( close to " + target_angle + ")");
					filtered.push({gui: test_gui, dist: distance});
				}
				else {
					//SKOOKUM.log("Bad angle = " + angle + "(or " + (angle + Math.PI * 2) + ") ( not close to " + target_angle + ")");
				}
			}
		}
		if (filtered.length === 0) {
			return null;
		}
		var shortest_i = -1;
		if (filtered.length > 0) {
			for (i in filtered) {
				distance = Math.sqrt(Math.pow(filtered[i].gui.y - node_gui.y, 2) + Math.pow(filtered[i].gui.x - node_gui.x, 2));
				filtered[i].dist += (Math.sqrt(distance) * 0.3);				
				SKOOKUM.log("Checking " + filtered[i].gui.data.title + ": " + distance + " linear distance making " + filtered[i].dist + " total distance.");				
				if (shortest_i === -1 || filtered[i].dist < filtered[shortest_i].dist) {
					shortest_i = i;
					SKOOKUM.log("Shortest i is now " + filtered[i].gui.data.title);
				}				
			}
		}
		if (shortest_i === -1) {
			return null;
		}
		return filtered[shortest_i].gui;
	},
	
	shift: function(gui, direction) {
		var options;
		var to_gui = null;
		
		SKOOKUM.log("shifting " + gui + " " + direction + "!!");
		if (direction === "up") {
			to_gui = this._next_gui_at_angle(gui, 1.5 * Math.PI);
		}
		else if (direction === "left") {
			to_gui = this._next_gui_at_angle(gui, Math.PI);
		}
		else if (direction === "down") {
			to_gui = this._next_gui_at_angle(gui, 0.5 * Math.PI);
		}
		else if (direction === "right") {
			to_gui = this._next_gui_at_angle(gui, 0);
		}
		else {
			return;
		}
		if (to_gui) {
			$(this).trigger('node-gui-focus', [ to_gui ]);
		}	
	}
	
}
jQuery.widget("sm.sitemap", SKOOKUM.SM.SitemapProto);