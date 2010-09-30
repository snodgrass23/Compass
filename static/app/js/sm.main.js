SKOOKUM.SM = SKOOKUM.SM || {};


SKOOKUM.SM.default_data = function() {
/*	return new SKOOKUM.SM.NodeData(
		{
			title: "Start Here"
			, layout: "TreeDown"
			, children: []
		}
	);
*/
  return new SKOOKUM.SM.NodeData({"title":"Ninja Turtles","layout":"TreeDown","children":[{"title":"A","layout":"TreeDown","children":[]},{"title":"B","layout":"TreeDown","children":[]},{"title":"C","layout":"TreeDown","children":[{"title":"D","layout":"TreeDown","children":[]},{"title":"E","layout":"TreeDown","children":[]},{"title":"F","layout":"TreeDown","children":[]}]}]});
};

//SKOOKUM.SM.test_data = new SKOOKUM.SM.NodeData().generate_random(5);

SKOOKUM.SM.init = {

	create_widgets: function () {
		SKOOKUM.SM.map = $("#map-container").sitemap();
		SKOOKUM.SM.map.sitemap('build', SKOOKUM.SM.default_data() );

		SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
		
		$("#selection").toolboxSelection	({ header: false });
		$("#appearance").toolboxAppearance	({ title: "Layout of Children", requires_selection: true });
		$("#document").toolboxDocument		({ header: false });
		$("#palette").toolbox				({ title: "Palette" });
		$("#history").toolbox				({ title: "History" });
		//$("#navigator").toolbox				({ title: "Navigator" });

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
		
		$('#download-list .svg').click(function(event) {
			var svg = SKOOKUM.SM.map.sitemap('get_svg');
			$.download('download.svg', { 'attachment':svg }, 'POST');
			return false;
		});	
		
		$('#download-list .json').click(function(event) {
		  var json = SKOOKUM.SM.map.sitemap('get_json');
		  $.download('download.json', { 'attachment':json }, 'POST');
		  return false;
		});
		
	}
	
};

$(document).ready(function () {
	SKOOKUM.SM.init.create_widgets();
	SKOOKUM.SM.init.create_listeners();
});