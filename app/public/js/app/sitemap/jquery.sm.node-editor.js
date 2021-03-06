SKOOKUM.SM.NodeEditorProto = {

	options: {
		class_name: "node-editor",
		opacity: 0.9,
		dim_opacity: 0.3,
		dim_delay: 1500
	},

	_create: function() {
		this.element.hide();
		this.node_gui = null;
		this.sitemap_instance = null;
		this.active = false;
		this.held_by_mouse = false;
		
		this.element.addClass('node-editor');
		this.element.append('<form> \
					<input class="title" type="text" /> \
					<div class="input-actions"> \
						<ul> \
							<li><a href="#" class="action accept-change">apply <em>enter</em></a></li> \
							<li><a href="#" class="action cancel-change">cancel <em>escape</em></a></li> \
						</ul> \
					</div> \
					<div class="actions"> \
						<ul> \
							<li><a href="#" class="action new-child">child <em>shift+enter</em></a></li> \
							<li class="sibling-btn"><a href="#" class="action new-sibling">sibling <em>tab</em></a></li> \
						</ul> \
						<ul class="alt"> \
							<li><a href="#" class="warn action delete-node">kill <em>shift+delete</em></a></li> \
						</ul> \
					</div> \
				</form>');
		
		this.close_btn = $('<a href="#" class="close-btn"></a>');
		this.element.append(this.close_btn);
		
		this.input_actions = this.element.find(".input-actions");
		this.sibling_btn = this.element.find(".sibling-btn");
		
		this._create_event_listeners();
		this._create_keyboard_listeners();
	},
	
	_create_event_listeners: function() {
		var that = this;
		
		$(document).bind('edit-node-gui', function(event, node_gui) {			// Edit any nodes on the page
			that.edit_node(node_gui);
		});
		
		$(document).bind('added-node-gui', function(event, node_gui, sitemap_instance) {	// Edit any nodes added to the currently active sitemap view
			if (sitemap_instance === that.sitemap_instance) {
				that.edit_node(node_gui);
			}
		});
		
		$(document).bind('resize drag', function (event) {
			if (event.target == that.sitemap_instance) {
				that._position_over_gui();
			}
		});
		
		this.element.mouseleave(function (event) {
			SKOOKUM.log("mouseleave!");
			that.held_by_mouse = false;
			that._dim();
		});
		
		this.element.bind("mouseenter", function (event) {
			that.held_by_mouse = true;
			that._undim();
		});
		
		this.element.find("form").submit(function() {
			return false;
		});
		
		this.element.find(".accept-change").click(function() {
			that.node_gui.data.set_title(that.element.find("input").val());
			that.hide();
		});
		
		this.close_btn.click(function(event) {
			that.hide();
		});
		
		this.element.find(".cancel-change").click(function() {
			that.hide();
		});
		
		this.element.find(".new-child").click(function() {
			var new_child = that.node_gui.data.add_child();
			return false;
		});
		
		this.element.find(".new-sibling").click(function() {
			var new_sibling = that.node_gui.data.add_sibling();
			return false;
		});
		
		this.element.find(".delete-node").click(function () {
			that.node_gui.data.delete_self_recursive();
			return false;
		});
	
	},
	
	_create_keyboard_listeners: function() {
		var that = this;
		
		this.element.find("input")
			.keydown(function(event) {
				if (!that.active) {
					return false;
				}
				
				that._undim();
			
				if (event.which === 13 && event.shiftKey) {			// Enter + Shift
					that.node_gui.data.set_title($(this).val());
					that.node_gui.data.add_child();
				}
				
				else if (event.which === 13) {						// Enter by itself
					that.node_gui.data.set_title($(this).val());
				}
				
				else if (event.which === 9) {						// Tab
					that.node_gui.data.set_title($(this).val());
					that.node_gui.data.add_sibling();
				}
				
				else if (event.which === 27) {						// Escape
					that.hide();
				}
				
				else if (event.which === 8 && event.shiftKey) {
					that.node_gui.data.delete_self_recursive();
				}
				
				else {
					SKOOKUM.log("Keycode: " + event.which);
					return true;
				}
				
				return false;
			})
			.keyup(function (event) {
				that._check_value();
			});
		
		$(document).keydown(function (event) {
			if (!that.active) {
				return;
			}

			if (event.shiftKey) {
				if (event.which === 38) {		// Up
					that.sitemap_instance.shift(that.node_gui, "up");
				}
				else if (event.which === 39) {	// Right
					that.sitemap_instance.shift(that.node_gui, "right");
				}
				else if (event.which === 40) {	// Down
					that.sitemap_instance.shift(that.node_gui, "down");
				}
				else if (event.which === 37) {	// Left
					that.sitemap_instance.shift(that.node_gui, "left");
				}
				else {
					return true;
				}
				return false;
			}
		});
	},
	
	_position_over_gui: function(node_gui) {
		node_gui = node_gui || this.node_gui;

		if (!node_gui) {
			return;
		}
		
		target = node_gui.get_page_coords();
		target.left -= this.element.innerWidth() * .5;
		target.top -= (this.element.innerHeight() + node_gui.height * .5);
		target.top += 8;
		
		this.element.css('top', target.top);
		this.element.css('left', target.left);
		
		// Stay centered
		
		// This causes crashing, "too much recursion," look into it.
		/*
		if (target.left > $(this.sitemap_instance.raph_wrap).innerWidth() * .7) {
			SKOOKUM.log("Far right!");
			this.sitemap_instance.offset(-(target.left - $(this.sitemap_instance.raph_wrap).innerWidth() * .7), 0);
		}
		*/
	},
		
	_register_listeners: function() {
		if (!this.node_gui) {
			return;
		}
		
		$(this.node_gui).bind('delete-node-gui', this, this._handle_deleted);
		$(this.node_gui).bind('moved-node-gui', this, this._handle_moved);
	},
	
	_handle_deleted: function(event) {	// event.data === this
		event.data.hide();
	},
	
	_handle_moved: function(event) {	// event.data === this
		event.data._position_over_gui();
	},
	
	_unregister_listeners: function() {
		$(this.node_gui).unbind('delete-node-gui', this._handle_deleted);
		$(this.node_gui).unbind('moved-node-gui', this._handle_moved);
	},
	
	_dim: function() {
		if (this.active && !this.held_by_mouse) {
			SKOOKUM.log("dim");
			this.element.stop().fadeTo(200, this.options.dim_opacity);
		}
	},
	
	_undim: function() {
		var that = this;
		this.element.stop().fadeTo(200, this.options.opacity);
		if (this._dimtime) {
			clearTimeout(this._dimtime);
		}
		this._dimtime = setTimeout(function() {
			that._dim();
		}, this.options.dim_delay);
	},
	
	_check_value: function() {
		if (!this.node_gui) {
			return;
		}
		if (this.element.find("input").first().val() !== this.node_gui.data.title) {
			SKOOKUM.log(this.element.find("input").first().val() + " !== " + this.node_gui.data.title)
			this.input_actions.show();
		}
		else {
			this.input_actions.hide();
		}
	},
	
	_check_parent: function() {
		if (this.node_gui.parent) {
			this.sibling_btn.show();
		}
		else {
			this.sibling_btn.hide();
		}
	},
	
	edit_node: function(node_gui) {
		var target;
		
		if (this.node_gui) {
			this._unregister_listeners();
		}
		
		this.node_gui = node_gui;
		
		if (node_gui) {
			this.active = true;
			this.sitemap_instance = node_gui.ownerDocument;
			
			this._position_over_gui(node_gui);	
			this._undim();
			this._check_parent();
			
			var input = this.element.find("input").first();
			input.val(node_gui.data.title);
			input.focus();
			input.select();
			
			this._check_value();
			
			this._register_listeners();
			
			this._trigger("edit", null, {'node_gui':node_gui});		// TODO: Convert others to this style, which doesn't rely on "ownerDocument"
		}
		
		else {
			this.hide();
		}
	},
	
	hide: function() {
		this.active = false;
		this.node_gui = null;
		this.sitemap_instance = null;
		this.element.stop().fadeOut(100);
		this._trigger("edit", null, {'node_gui':null});
	}
};

jQuery.widget("sm.nodeEditor", SKOOKUM.SM.NodeEditorProto);