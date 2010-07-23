
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
	SKOOKUM.SM.map = $("#map").siteMap();
	//$("#map2").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);
	//$("#map2").siteMap('build', SKOOKUM.SM.test_data, 100, 100);
	
	$('[title]').tooltip({
		position: {
			my: 'bottom center',
			at: 'top center',
			offset: "0 -25"
		}
	});
	$('#fullscreen-btn').toggle(
		function(event) {
			$('body').addClass('full');
		},
		function(event) {
			$('body').removeClass('full');
		}
	);
	$('#scale150-btn').click(function(event) {
		SKOOKUM.SM.map.siteMap('zoom', 1.5);
	});
}
