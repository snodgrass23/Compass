SKOOKUM.SM = SKOOKUM.SM || {};


SKOOKUM.SM.ToolboxProto = {
	options: {
		header: true,
		title: "",
		requires_selection: false
	},
	_create: function() {
		var that = this;
		this.element.addClass('toolbox');
		this.options.header && this.element.append("<h1>" + this.options.title + "</h1>");
		this.element.append('<div class="toolbox-contents">\
							</div>');
							
		if (this.options.requires_selection) {
			$(document).bind('nodeeditoredit', function(event, ui) {
				if (ui.node_gui) {
					that.element.show();
				}
				else {
					that.element.hide();
				}
			});
			that.element.hide();
		}								
	}
};

$.widget("sm.toolbox", SKOOKUM.SM.ToolboxProto);


