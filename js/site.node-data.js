SKOOKUM.SM = SKOOKUM.SM || {};

/*
	Constructor
*/
SKOOKUM.SM.NodeData = function (data, parent) {
	data = data || {};
	
	this.title = data.title || "";
	this.parent = parent || null;
	this.children = [];
	this.layout = new SKOOKUM.SM.NodeLayout();
	
	if(data.children) {
		for(var i in data.children) {
			var new_child = new SKOOKUM.SM.NodeData(data.children[i], this);
			this.children.push(new_child);
		}
	}
};
/*
	Methods
*/
(function(proto) {
	proto.add_child = function(data) {
		var child = new SKOOKUM.SM.NodeData(data, this);
		this.children.push(child);
		$(this).trigger('add-node', [child]);
		return child;
	};
	proto.add_sibling = function(data) {
		var sibling = new SKOOKUM.SM.NodeData(data, this.parent);
		this.parent.children.push(sibling);
		$(this.parent).trigger('add-node', [sibling]);
		return sibling;
	};
	proto.delete_self_recursive = function() {
		while (this.children.length > 0) {
			this.children[0].delete_self_recursive();
		}
		this.parent.children.splice(this.parent.children.indexOf(this), 1);
		$(this).trigger('delete-node');
	};
	proto.set_title = function(title) {
		this.title = title;
		$(this).trigger('update');
	};
}) (SKOOKUM.SM.NodeData.prototype);


/*
	Constructor
*/
SKOOKUM.SM.NodeLayout = function () {
	this.type = "branch";
	this.size = 10;
	this.spacing = 10;
	this.direction = "down";
}