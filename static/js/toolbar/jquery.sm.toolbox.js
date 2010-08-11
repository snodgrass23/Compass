SKOOKUM.SM = SKOOKUM.SM || {};


SKOOKUM.SM.ToolboxProto = {
	options: {
		header: true,
		title: ""
	},
	_create: function() {
		this.element.addClass('toolbox');
		this.options.header && this.element.append("<h1>" + this.options.title + "</h1>");
		this.element.append('<div class="toolbox-contents">\
								<br />\
							</div>');
	}
};

$.widget("sm.toolbox", SKOOKUM.SM.ToolboxProto);


