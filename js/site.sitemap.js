/*
Raphael methods: circle, clear, ellipse, getFont, image, mapNode, path, print, raphael, rect, remove, safari, set, setSize, text 
Raphael properties: bottom, canvas, defs, desc, height, svgns, top, width, xlink

Rect methods: animate, animateAlong, animateAlongBack, animateWith, attr, blur, click, clone, dblclick, drag, gesturechange, gestureend, gesturestart, getBBox, getPointAtLength, getSubpath, getTotalLength, hide, hover, insertAfter, insertBefore, mousedown, mousemove, mouseout, mouseover, mouseup, onAnimation, orientationchange, remove, resetScale, rotate, scale, show, stop, toBack, toFront, toString, touchcancel, touchend, touchmove, touchstart, translate, unclick, undblclick, ungesturechange, ungestureend, ungesturestart, unhover, unmousedown, unmousemove, unmouseout, unmouseover, unmouseup, unorientationchange, untouchcancel, untouchend, untouchmove, untouchstart
Rect properties: 0, _, attrs, id, next, node, paper, prev, transformations, type 
*/

SKOOKUM.SM = {};

SKOOKUM.SM.test_data = {
	  title: "Root node"
	  , children: [
		  { title: "First level 1", children: [] }
		, { title: "First level 2", children: [
			  { title: "2nd Level A", children: [
			  	  { title: "3rd Level X", children: [] }
			  	, { title: "3rd Level Y", children: [] }
			  ] }
			, { title: "2nd Level B", children: [] }
			, { title: "2nd Level C", children: [] }
		] }
	]
};

window.onload = function () {

	SKOOKUM.SM.map = $("#map").siteMap();
	SKOOKUM.SM.editor = $("#node-editor").nodeEditor();
	
	SKOOKUM.SM.map.siteMap('build', SKOOKUM.SM.test_data, 100, 100);

}
