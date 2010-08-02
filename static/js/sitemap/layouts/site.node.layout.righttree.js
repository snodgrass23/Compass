// 	Branching Down and then out:

/*
     |
   ~~~~~
   | | |
   o o o
*/

SKOOKUM.SM.NodeLayout["RightTree"] = function() {};
SKOOKUM.SM.NodeLayout["RightTree"].prototype = new SKOOKUM.SM.NodeLayout.Base();

(function (proto) {

	proto.name = "RightTree";
	
	proto.apply_to = function(node_gui) {
		if (node_gui.children.length === 0) {
			return;
		}
			
		var total_height,
			child_x, child_y,
			parent_x, line_x,
			top_node, bottom_node,
			child_box,
			x, y,
			data,
			i,
			path;
		
		// Shortcuts for the relative root node (node_gui argument)
		x = node_gui.x;
		y = node_gui.y;
		data = node_gui.data;
		
		// Find Y of all children (will be the same)
		parent_x = x + (node_gui.width * .5);
		line_x = parent_x + this.size;
		child_x = line_x + this.size;
		path = "M " + parent_x + " " + y + " L " + line_x + " " + y + " " ;
		
		// Find HEIGHT of all children together with spacing
		total_height = 0;
		for (i in node_gui.children) {
			child_box = node_gui.children[i].get_box();
			total_height += child_box.height;
		}
		total_height -= node_gui.children[0].get_box().p_top;
		total_height -= node_gui.children[node_gui.children.length - 1].get_box().p_bottom;
		total_height += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_y = y - total_height * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_y += (child.height * .5) + child_box.p_top;
			if (i > 0) {
				child_y += child_box.p_top;
			}
			child_x = line_x + this.size + (child.width * .5) + child_box.p_left;
			path += "M " + line_x + " " + child_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			child_y += (child.height * .5) + child_box.p_bottom + this.spacing;
		}
		if(node_gui.children.length > 1) {
			top_node = node_gui.children[0];
			bottom_node = node_gui.children[data.children.length - 1];
			path += "M " + line_x + " " + top_node.y + " ";
			path += "L " + line_x + " " + bottom_node.y + " ";
		}			
		if(data.parent) {						// "Not Root"
			node_gui.set_path_str(path);
		}
	};	
	
}) (SKOOKUM.SM.NodeLayout["RightTree"].prototype);