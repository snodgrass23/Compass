SKOOKUM.SM = SKOOKUM.SM || {};

SKOOKUM.SM.NodeEditorProto = {
	options: {
		class_name: "node-editor",
		opacity: 0.9
	},
	edit_node: function(node_gui) {
		this.node_gui = node_gui;
		this.sitemap_instance = node_gui.ownerDocument;
		var target = node_gui.getPageCoords();
		target.left -= this.element.innerWidth() * .5;
		target.top -= (this.element.innerHeight() + node_gui.height * .5);
		target.top += 8;
		this.element.stop().fadeTo(250, this.options.opacity);
		this.element.css('top', target.top);
		this.element.css('left', target.left);
		var input = this.element.find("input").first();
		input.val(node_gui.data.title);
		input.focus();
		input.select();
		node_gui.activate();
	},
	hide: function() {
		this.element.stop().fadeOut(400);
		this.node_gui.deactivate();
	},
	set_size: function(val) {
		this.node_gui.data.layout.size = val;
		this.node_gui.update();
	},
	_create: function() {
	
		var that = this;
		this.element.hide();
		this.node_gui = null;
		this.sitemap_instance = null;
		
		$(document).bind('edit-node-gui', function(event, node_gui) {
			SKOOKUM.log("EVENT: edit-node");
			that.edit_node(node_gui);
		});
		$(document).bind('added-node-gui', function(event, node_gui, sitemap_instance) {
			if (sitemap_instance === that.sitemap_instance) {
				that.edit_node(node_gui);
			}
		});
		this.element.find("input").change(function(event) {
			SKOOKUM.log("EVENT: change");
			that.node_gui.data.set_title($(this).val());
			that.hide();
		});
		this.element.find("input").keydown(function(event) {
			if (event.which === 13) {	// Enter
				SKOOKUM.log("EVENT: Enter pressed");
				//$(this).trigger('change');
				that.node_gui.data.set_title($(this).val());
				that.node_gui.data.add_child();
				return false;
			}
			else if (event.which === 9) {	// Tab
				SKOOKUM.log("EVENT: Tab pressed");
				//$(this).trigger('change');
				that.node_gui.data.set_title($(this).val());
				that.node_gui.data.add_sibling();
				return false;
			}
			else if (event.which === 27) {	// Escape
				that.node_gui.data.set_title($(this).val());
				$(this).blur();
				return false;
			}
		});
		this.element.find("input").blur(function(event) {
			SKOOKUM.log("EVENT: blur");
			that.hide();
		});
		this.element.find("form").submit(function() {
			return false;
		});
		this.element.find(".action-new-child").click(function() {
			SKOOKUM.log("action-new-child");
			var new_child = that.node_gui.data.add_child();
			return false;
		});
		this.element.find(".action-new-sibling").click(function() {
			var new_sibling = that.node_gui.data.add_sibling();
			return false;
		});
		this.element.find(".action-delete").click(function () {
			that.node_gui.data.delete_self_recursive();
			return false;
		});
		/*
		this.element.find(".size.slider").slider({
			value: 10,
			min: 10,
			max: 40,
			step: 1,
			slide: function(event, ui) {
				that.set_size(ui.value);	
			}
		});
		*/
	}
}
jQuery.widget("ui.nodeEditor", SKOOKUM.SM.NodeEditorProto);