SKOOKUM.SM = SKOOKUM.SM || {};


// Constructor

SKOOKUM.SM.NodeData = function (data, parent) {
	data = data || {};
	
	this.title = data.title || "";
	this.parent = parent || null;
	this.layout = data.layout || "TreeDown";
	this.children = [];
	this.ownerDocument = document;								// For event bubbling from non-DOM objects
	
	if(data.children) {
		for(var i in data.children) {
			var new_child = new SKOOKUM.SM.NodeData(data.children[i], this);
			this.children.push(new_child);
		}
	}
	return this;
};


// Methods

(function(proto) {

	proto.add_child = function(data) {
		var child = new SKOOKUM.SM.NodeData(data, this);
		this.children.push(child);
		$(this).trigger('add-node', [child]);
		return child;
	};
	
	proto.add_sibling = function(data) {
		if (this.parent) {
			return this.parent.add_child(data);
		}
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
	
	proto.generate_random = function(min_children, depth, ascii) {
		min_children = min_children || 0;
		depth = depth || 7;
		ascii = ascii || 65;
		depth -= 1;
		if (depth < 1) return;
		this.title = String.fromCharCode(ascii);
		var num_children = Math.max(Math.floor(Math.random() * 10) - (9 - depth), min_children);
		if (num_children < 1) return; 
		for (var i = 0; i < num_children; i++) {
			ascii++;
			this.add_child({title: String.fromCharCode(ascii)});
		}
		for (var j in this.children) {
			this.children[j].generate_random(0, depth, ascii);
		}
		return this;
	};
	
}) (SKOOKUM.SM.NodeData.prototype);
