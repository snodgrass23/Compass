SKOOKUM.SM.NodeLayout = {};


/*
	Base Prototype for Layouts
*/
SKOOKUM.SM.NodeLayout.Base = function () {
	this.type = "branch";
	this.size = 10;
	this.spacing = 10;
	this.direction = "down";
};
(function (proto) {

	proto.apply_to = function(node_gui) { };
	
}) (SKOOKUM.SM.NodeLayout.Base.prototype);




/*
	Branching Down and then out:
     |
   ~~~~~
   | | |
   o o o
*/
SKOOKUM.SM.NodeLayout["BranchDown"] = function() {};
SKOOKUM.SM.NodeLayout["BranchDown"].prototype = new SKOOKUM.SM.NodeLayout.Base();
(function (proto) {
	proto.apply_to = function(node_gui) {
	
		if (node_gui.children.length === 0) {
			return;
		}
			
		var total_width,
			child_x, child_y,
			parent_y, line_y,
			left_node, right_node,
			child_box,
			x, y,
			data,
			i,
			path;
		
		//var path = "M " + x + " " + (child_y) + " L " + x + " " + split_y + " " ;
		
		// Shortcuts for the relative root node (node_gui argument)
		x = node_gui.x;
		y = node_gui.y;
		data = node_gui.data;
		
		// Find Y of all children (will be the same)
		parent_y = y + (node_gui.height * .5);
		line_y = parent_y + this.size;
		child_y = line_y + this.size;
		path = "M " + x + " " + parent_y + " L " + x + " " + line_y + " " ;
		
		// Find WIDTH of all children together with spacing
		total_width = 0;
		for (i in node_gui.children) {
			child_box = node_gui.children[i].get_box();
			total_width += child_box.width;
		}
		total_width += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_x = x - total_width * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_x = child_x + (child_box.width * .5);
			path += "M " + child_x + " " + line_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y + (child.height * .5));
			child_x = child_x + (child_box.width * .5) + this.spacing;
		}
		if(node_gui.children.length > 1) {
			left_node = node_gui.children[0];
			right_node = node_gui.children[data.children.length - 1];
			path += "M " + left_node.x + " " + line_y + " ";
			path += "L " + right_node.x + " " + line_y + " ";
		}			
		if(data.parent) {						// "Not Root"
			node_gui.set_path_str(path);
		}
	};	
}) (SKOOKUM.SM.NodeLayout["BranchDown"].prototype);



/*
	Branching Right and then out:
     |--o
   --|--o
     |--o
*/
SKOOKUM.SM.NodeLayout["BranchRight"] = function() {};
SKOOKUM.SM.NodeLayout["BranchRight"].prototype = new SKOOKUM.SM.NodeLayout.Base();
(function(proto) {
	proto.position = function(sitemap, x, y, node_gui) {
		var i = null,
			parent_height = 0,
			data = node_gui.data;
				
		// Sometimes we're just refreshing child nodes, so we want to keep the current position
		x = x || node_gui.x;
		y = y || node_gui.y;
		
		node_gui.move_to(x, y);
		parent_width = node_gui.width;
		
		if (node_gui.children.length === 0) {
			return;
		}
		var child_x = x + parent_width * .5;
		var total_height = 0;
		var split_x = child_x + this.size;
		var path = "M " + child_x + " " + y + " L " + split_x + " " + y + " " ;
		child_x += this.size * 2;
		for (i in node_gui.children) {
			total_height += node_gui.children[i].height;
		}
		total_height += ( this.spacing * (node_gui.children.length - 1) );
		var child_y = y - total_height * .5; // - total_width * .5;
		for (i in node_gui.children) {
			child_y = child_y + (node_gui.children[i].height * .5);
			path += "M " + split_x + " " + child_y + " ";
			path += "L " + split_x + " " + (child_y + this.size) + " ";
			node_gui.children[i].layout_at(sitemap, child_x + (node_gui.children[i].width * .5), child_y);
			child_y = child_y + (node_gui.children[i].height * .5) + this.spacing;
		}
		if(node_gui.children.length > 1) {
			var node1 = node_gui.children[0];
			var node2 = node_gui.children[data.children.length - 1];
			path += "M " + split_x + " " + node1.y + " ";
			path += "L " + split_x + " " + node2.y + " ";
		}			
		if(data.parent) {
			//SKOOKUM.log("Path is " + path);
			//node_gui.set_path(this.raph.path(path));	// TODO: Clean up!
			node_gui.set_path_str(path);
		}		
	};
}) (SKOOKUM.SM.NodeLayout["BranchRight"].prototype);