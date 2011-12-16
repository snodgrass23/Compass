
// Base Prototype for Layouts

SKOOKUM.SM.NodeLayout = function (name) {
	this.name = name;
	this.size = 10;
	this.spacing = 10;
};

SKOOKUM.SM.NodeLayout.create = function (name, apply_function) {
	SKOOKUM.SM.NodeLayout[name] = function() {};
	SKOOKUM.SM.NodeLayout[name].prototype = new SKOOKUM.SM.NodeLayout(name);
	SKOOKUM.SM.NodeLayout[name].prototype.apply_to = apply_function;
};

SKOOKUM.SM.NodeLayout.instance = function(name) {
  //name = "TreeDown";  // TODO: Remove this hack
	return new SKOOKUM.SM.NodeLayout[name]();
};

SKOOKUM.SM.NodeLayout.exists = function(name) {
	return Boolean(SKOOKUM.SM.NodeLayout[name]);
}