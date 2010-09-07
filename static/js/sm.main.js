SKOOKUM.SM = SKOOKUM.SM || {};


SKOOKUM.SM.default_data = function() {
	return new SKOOKUM.SM.NodeData({
		title: "Root node", children: [
				{ title: "Start Here", children: [] }
		]
	});
};

//SKOOKUM.SM.test_data = new SKOOKUM.SM.NodeData().generate_random(5);

SKOOKUM.SM.init = {

	create_widgets: function () {
		SKOOKUM.SM.map = $("#map-container").sitemap();
		SKOOKUM.SM.map.sitemap('build', SKOOKUM.SM.default_data() );

		SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
		
		$("#selection").toolboxSelection	({ header: false });
		$("#appearance").toolboxAppearance	({ title: "Layout of Children" });
		$("#palette").toolbox				({ title: "Palette" });
		$("#history").toolbox				({ title: "History" });
		$("#navigator").toolbox				({ title: "Navigator" });

		$("#toolbar").draggable({containment: "parent", handle: ".handle"});
				
		$('[title]').tooltip({
			position: {
				my: 'bottom center',
				at: 'top center',
				offset: "0 -25"
			}
		});	
	},
	
	create_listeners: function() {
		
		$('#new-btn').click(function(event) {
			SKOOKUM.SM.map.sitemap('build', SKOOKUM.SM.default_data() );
			return false;
		});
		
		$('#fullscreen-btn').toggle(
			function(event) {
				$('body').addClass('full');
				$(window).trigger('resize');
				return false;
			},
			function(event) {
				$('body').removeClass('full');
				$(window).trigger('resize');
				return false;
			}
		);
		
		$('#download-btn').click(function(event) {
			var svg = SKOOKUM.SM.map.sitemap('get_svg');
			$.download('download', { 'svg':svg }, 'POST');
			return false;
		});	
	}
	
};

$(document).ready(function () {
	SKOOKUM.SM.init.create_widgets();
	SKOOKUM.SM.init.create_listeners();
});