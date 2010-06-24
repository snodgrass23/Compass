/*
Raphael methods: circle, clear, ellipse, getFont, image, mapNode, path, print, raphael, rect, remove, safari, set, setSize, text 
Raphael properties: bottom, canvas, defs, desc, height, svgns, top, width, xlink

Rect methods: animate, animateAlong, animateAlongBack, animateWith, attr, blur, click, clone, dblclick, drag, gesturechange, gestureend, gesturestart, getBBox, getPointAtLength, getSubpath, getTotalLength, hide, hover, insertAfter, insertBefore, mousedown, mousemove, mouseout, mouseover, mouseup, onAnimation, orientationchange, remove, resetScale, rotate, scale, show, stop, toBack, toFront, toString, touchcancel, touchend, touchmove, touchstart, translate, unclick, undblclick, ungesturechange, ungestureend, ungesturestart, unhover, unmousedown, unmousemove, unmouseout, unmouseover, unmouseup, unorientationchange, untouchcancel, untouchend, untouchmove, untouchstart
Rect properties: 0, _, attrs, id, next, node, paper, prev, transformations, type 
*/

var SITEMAP = SITEMAP || {};

var test = [{
	  title: "Root node"
	, children: [
		  { title: "First level 1", children: [] }
		, { title: "First level 2", children: [
			  { title: "2nd Level A", children: [] }
			, { title: "2nd Level B", children: [] }
			, { title: "2nd Level C", children: [] }
		] }
	]
}];

window.onload = function () {

	SITEMAP.map = $("#map");
	SITEMAP.editor = $("#node-editor");
	
	SITEMAP.map.nodeMap();
	SITEMAP.editor.nodeEditor();
	
	SITEMAP.map.nodeMap('build', test);
	//SITEMAP.map.nodeMap('add_node', 'Home is where the heart is', 100, 100);
	//SITEMAP.map.nodeMap('add_node', 'Another node', 200, 200);

}
