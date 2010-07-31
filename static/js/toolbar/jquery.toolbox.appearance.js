SKOOKUM.SM.ToolboxAppearanceProto = {

	_create: function() {
		$.sm.toolbox.prototype._create.call(this);
		
		this.element.find(".toolbox-contents")
			.prepend('<p class="selection"></p>\
				<ul class="layouts">\
					<li><a href="#" class="action layout-down-tree" title="Tree, down"></a></li>\
					<li><a href="#" class="action layout-down-ladder" title="Ladder, down"></a></li>\
					<li><a href="#" class="action layout-down-L" title="L, down"></a></li>\
					<li><a href="#" class="action layout-right-tree" title="Tree, right"></a></li>\
					<li><a href="#" class="action layout-right-double" title="Double, right"></a></li>\
					<li><a href="#" class="action layout-right-ladder" title="Chain, right"></a></li>\
				</ul>');

		this.data = null;
		this.selection = this.element.find(".selection");
		
		this._create_listeners();
		this._edit(null);
	},
	
	_create_listeners: function() {
		var that = this;
		
		$(document).bind('nodeeditoredit', function(event, ui) {
			that._edit(ui.node_gui);
		});
		
		SKOOKUM.log("Creating listeners...");
		$(this.element).find(".layouts").click(function(event) {
			var btn = $(event.target);
			
			SKOOKUM.log("Click on " + btn);
			if (btn.hasClass('layout-down-tree')) {
				that.data.set_layout("DownTree");
			}
			else if (btn.hasClass('layout-down-ladder')) {
				that.data.set_layout("DownLadder");
			}
			else if (btn.hasClass('layout-right-tree')) {
				that.data.set_layout("RightTree");
			}
			
			return false;
		});
	},
	
	_edit: function(node_gui) {
		this.data = (node_gui) ? node_gui.data : null;
	
		if (this.data) {
			this.selection.html('"' + this.data.title + '"');
		}
		
		else {
			this.selection.html("No selection");
		}
	}
	
};

$.widget("sm.toolboxAppearance", $.sm.toolbox, SKOOKUM.SM.ToolboxAppearanceProto);