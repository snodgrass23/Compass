
SKOOKUM.SM = SKOOKUM.SM || {};

SKOOKUM.SM.test_data = new SKOOKUM.SM.NodeData(
	{ title: "Root node", children: [
			{ title: "Start Here", children: [] }
	]
});

window.onload = function () {
	SKOOKUM.SM.map = $("#map").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);
}
