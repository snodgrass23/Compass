SKOOKUM.SM.NodeEditorProto = {

	options: {
		class_name: "node-editor",
		opacity: 0.9
	},

	_create: function() {
		this.element.hide();
		this.node_gui = null;
		this.sitemap_instance = null;
		
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
				that.hide();
			}
		});
		
		this.element.find("form").submit(function() {
			return false;
		});
		
		this.element.find(".accept-change").click(function() {
			that.node_gui.data.set_title(that.element.find("input").val());
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
		
		this.element.find("input").keydown(function(event) {
		
			if (event.which === 13 && event.shiftKey) {			// Enter + Shift
				that.node_gui.data.set_title($(this).val());
				that.node_gui.data.add_child();
			}
			
			else if (event.which === 13) {						// Enter by itself
				that.node_gui.data.set_title($(this).val());
				that.hide();
			}
			
			else if (event.which === 9) {						// Tab
				that.node_gui.data.set_title($(this).val());
				that.node_gui.data.add_sibling();
			}
			
			else if (event.which === 27) {						// Escape
				that.hide();
			}
			
			else {
				return true;
			}
			
			return false;
		});
	},	
	
	edit_node: function(node_gui) {
		var target;
		this.node_gui = node_gui;
		this.sitemap_instance = node_gui.ownerDocument;
		
		target = node_gui.get_page_coords();
		target.left -= this.element.innerWidth() * .5;
		target.top -= (this.element.innerHeight() + node_gui.height * .5);
		target.top += 8;
		
		this.element.stop().fadeTo(200, this.options.opacity);
		this.element.css('top', target.top);
		this.element.css('left', target.left);
		
		var input = this.element.find("input").first();
		input.val(node_gui.data.title);
		input.focus();
		input.select();
		
		this._trigger("edit", null, {'node_gui':node_gui});		// TODO: Convert others to this style, which doesn't rely on "ownerDocument"
	},
	
	hide: function() {
		this.node_gui = null;
		this.sitemap_instance = null;
		this.element.stop().fadeOut(100);
		this._trigger("edit", null, {'node_gui':null});
	}
};

jQuery.widget("sm.nodeEditor", SKOOKUM.SM.NodeEditorProto);