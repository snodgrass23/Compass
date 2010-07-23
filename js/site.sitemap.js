
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
	$('#fullscreen-btn').toggle(
		function(event) {
			$('body').addClass('full');
		},
		function(event) {
			$('body').removeClass('full');
		}
	);
	SKOOKUM.SM.map = $("#map").siteMap();
	//$("#map2").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);
	//$("#map2").siteMap('build', SKOOKUM.SM.test_data, 100, 100);
}
