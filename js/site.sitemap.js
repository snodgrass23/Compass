
SKOOKUM.SM = SKOOKUM.SM || {};

/*
SKOOKUM.SM.test_data = new SKOOKUM.SM.NodeData(
	{ title: "Root node", children: [
			{ title: "Start Here", children: [] }
	]
});
*/

SKOOKUM.SM.test_data = new SKOOKUM.SM.NodeData().generate_random(5);

window.onload = function () {
	SKOOKUM.SM.layout = $('body').layout({
		defaults: {
			fxName:					"slide",
			fxSpeed:				200,
			resizable:				false,
			slidable:				false,
			spacing_open:			0,
			spacing_closed:			15,
			initClosed:				false,
			togglerLength_closed:	"15",
			togglerLength_open:		"0",
			togglerAlign_closed:	"top"
		},
		north: {
			
		},
		east: {
			initClosed:				false
		}
	});
	SKOOKUM.SM.layout.addCloseBtn('#toolbar-closer', 'east');
	$('#fullscreen-button').click(function(event) {
		SKOOKUM.SM.layout.toggle('east');
		SKOOKUM.SM.layout.toggle('north');
	});
	SKOOKUM.SM.map = $("#map").siteMap();
	//$("#map2").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);
	//$("#map2").siteMap('build', SKOOKUM.SM.test_data, 100, 100);
}
