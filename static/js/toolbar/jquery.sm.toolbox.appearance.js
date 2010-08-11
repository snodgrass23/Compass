SKOOKUM.SM.ToolboxAppearanceProto = {

	_create: function() {
		$.sm.toolbox.prototype._create.call(this);
		
		this.node_gui = null;
		this.layouts = $('<ul class="layouts">\
					<li><a href="#" class="TreeDown" title="Tree, down"></a></li>\
					<li><a href="#" class="LadderDown" title="Ladder, down"></a></li>\
					<li><a href="#" class="LDown" title="L, down"></a></li>\
					<li><a href="#" class="TreeRight" title="Tree, right"></a></li>\
					<li><a href="#" class="DoubleRight" title="Double, right"></a></li>\
					<li><a href="#" class="LadderRight" title="Chain, right"></a></li>\
				</ul>');
		
		this.element.find(".toolbox-contents")
			.prepend(this.layouts);

		this._create_listeners();
		this._edit(null);
	},
	
	_create_listeners: function() {
		//return;
		
		var that = this;
		
		$(document).bind('nodeeditoredit', function(event, ui) {
			that._edit(ui.node_gui);
		});
		
		$(document).bind('update-node-gui', function(event) {
			if (event.target == that.node_gui) {
				that._update();
			}
		});
		
		this.layouts.mousedown(function(event) {
			var btn = $(event.target);
			
			that.node_gui.set_layout(btn.attr('class'));
			
			return false;
		});
	},
	
	_edit: function(node_gui) {
		this.node_gui = node_gui;
		this._update();
	},
	
	_update: function() {		
		if (this.node_gui) {
			var active_layout = this.node_gui.get_layout();
			
			this.layouts.find("a").each(function() {
				if ($(this).hasClass(active_layout)) {
					$(this).addClass('active');
				}
				else {
					$(this).removeClass('active');
				}
			});	
			
			this.layouts.show();
		}
		
		else {
			this.layouts.hide();
		}
	}
	
};

$.widget("sm.toolboxAppearance", $.sm.toolbox, SKOOKUM.SM.ToolboxAppearanceProto);