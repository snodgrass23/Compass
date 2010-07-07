/*
	Constructor
*/
SKOOKUM.SM.NodeLayout = function () {
	this.type = "branch";
	this.size = 10;
	this.spacing = 10;
	this.direction = "down";
};

(function (proto) {
	proto.position = function(view_id, x, y, node_gui) {
	
		var i = null,
			parent_height = 0,
			data = node_gui.data;
				
		// Sometimes we're just refreshing child nodes, so we want to keep the current position
		x = x || node_gui.x;
		y = y || node_gui.y;
		
		SKOOKUM.log("moving " + node_gui.data.title + " to " + x + ", " + y);
		node_gui.moveTo(x, y);
		parent_height = node_gui.height;
		
		if (node_gui.children.length === 0) {
			return;
		}
		var child_y = y + parent_height * .5;
		var total_width = 0;
		var split_y = child_y + this.size;
		var path = "M " + x + " " + (child_y) + " L " + x + " " + split_y + " " ;
		child_y += this.size * 2;
		for (i in node_gui.children) {
			total_width += node_gui.children[i].width;
		}
		total_width += ( this.spacing * (node_gui.children.length - 1) );
		var child_x = x - total_width * .5; // - total_width * .5;
		for (i in node_gui.children) {
			child_x = child_x + (node_gui.children[i].width * .5);
			path += "M " + child_x + " " + split_y + " ";
			path += "L " + child_x + " " + (split_y + this.size) + " ";
			node_gui.children[i].layout_at(view_id, child_x, child_y + (node_gui.children[i].height * .5));
			child_x = child_x + (node_gui.children[i].width * .5) + this.spacing;
		}
		if(node_gui.children.length > 1) {
			var node1 = node_gui.children[0];
			var node2 = node_gui.children[data.children.length - 1];
			path += "M " + node1.x + " " + split_y + " ";
			path += "L " + node2.x + " " + split_y + " ";
		}			
		if(data.parent) {
			//SKOOKUM.log("Path is " + path);
			//node_gui.set_path(this.raph.path(path));	// TODO: Clean up!
			node_gui.set_path_str(path);
		}
	}
}) (SKOOKUM.SM.NodeLayout.prototype);