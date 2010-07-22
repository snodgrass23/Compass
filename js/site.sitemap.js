
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
	$('body').layout({
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
	}).addCloseBtn('#toolbar-closer', 'east');
	SKOOKUM.SM.map = $("#map").siteMap();
	//$("#map2").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);
	//$("#map2").siteMap('build', SKOOKUM.SM.test_data, 100, 100);
}
