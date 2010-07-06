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
		target.top += 8;
		this.element.stop().fadeTo(250, 1.0);
		this.element.css('top', target.top);
		this.element.css('left', target.left);
		var input = this.element.find("input").first();
		input.val(node.title);
		input.focus();
		input.select();
		SKOOKUM.log(SKOOKUM.introspect(node));
		SKOOKUM.log("Node position: " + node.x + ", " + node.y);
		//node.activate();
	},
	hide: function() {
		this.element.stop().fadeOut(400);
		this.node.deactivate();
	},
	set_size: function(val) {
		jQuery.log("layout.size was " + this.node.data.layout.size + "...");
		this.node.data.layout.size = val;
		this.node.update();
		jQuery.log("... but now is " + this.node.data.layout.size);
	},
	_create: function() {
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
			that.hide();
		});
		this.element.find("form").submit(function() {
			return false;
		});
		this.element.find("action-new-child").click(function() {
			var new_child = that.node.data.addChild();
			$(document).trigger('edit-node', [new_child]);
			return false;
		});
		this.element.find(".action-new-sibling").click(function() {
			var new_sibling = that.node.data.addSibling();
			$(document).trigger('edit-node', [new_sibling]);
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
jQuery.widget("ui.nodeEditor", SKOOKUM.NodeEditorProto);