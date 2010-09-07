SKOOKUM.SM.ToolboxSelectionProto = {
	options: {
		always_visible: true
	},
	
	_create: function() {
		$.sm.toolbox.prototype._create.call(this);

		this.node_gui = null;
		this.selection = $('<p class="selection">No selection</p>');
		
		this.element.find(".toolbox-contents")
			.prepend(this.selection);
		
		this._create_listeners();
	},
	
	_create_listeners: function() {	
		var that = this;
		
		$(document).bind('nodeeditoredit', function(event, ui) {
			that._update(ui.node_gui);
		});
		
		$(document).bind('update-node-gui', function(event) {
			if (event.target == that.node_gui) {
				that._update();
			}
		});
		
	},
	
	_update: function(node_gui) {
		if (node_gui !== undefined) {
			this.node_gui = node_gui;
		}
		var html = (this.node_gui) ? '"' + this.node_gui.data.title + '"' : "No selection";
			html = (html.length > 2) ? html : "(no title)";

		this.selection.html(html);
	}
		
};

$.widget("sm.toolboxSelection", $.sm.toolbox, SKOOKUM.SM.ToolboxSelectionProto);