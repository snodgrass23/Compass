SKOOKUM.SM.NodeLayout = {};


// Base Prototype for Layouts

SKOOKUM.SM.NodeLayout.Base = function () {
	this.size = 10;
	this.spacing = 10;
};
(function (proto) {

	proto.name = "BaseLayout";	
	proto.apply_to = function(node_gui) { };
	
}) (SKOOKUM.SM.NodeLayout.Base.prototype);


SKOOKUM.SM.NodeLayout.create = function(name, apply_func) {		// Make this cleaner and more succinct 
	SKOOKUM.SM.NodeLayout[name] = function() {};
	SKOOKUM.SM.NodeLayout[name].prototype = new SKOOKUM.SM.NodeLayout.Base();
	SKOOKUM.SM.NodeLayout[name].prototype.name = name;
	SKOOKUM.SM.NodeLayout[name].prototype.apply_to = apply_func;
};

