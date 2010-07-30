SKOOKUM.SM.NodeLayout = {};


// Base Prototype for Layouts

SKOOKUM.SM.NodeLayout.Base = function () {
	this.type = "branch";
	this.size = 10;
	this.spacing = 10;
	this.direction = "down";
};
(function (proto) {

	proto.apply_to = function(node_gui) { };
	
}) (SKOOKUM.SM.NodeLayout.Base.prototype);