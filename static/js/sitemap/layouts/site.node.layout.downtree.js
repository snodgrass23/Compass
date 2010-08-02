// 	Branching Down and then out:

/*
     |
   ~~~~~
   | | |
   o o o
*/

SKOOKUM.SM.NodeLayout["DownTree"] = function() {};
SKOOKUM.SM.NodeLayout["DownTree"].prototype = new SKOOKUM.SM.NodeLayout.Base();

(function (proto) {

	proto.name = "DownTree";
	
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
		path = "M " + x + " " + parent_y + " L " + x + " " + line_y + " " ;
		
		// Find WIDTH of all children together with spacing
		total_width = 0;
		for (i in node_gui.children) {
			child_box = node_gui.children[i].get_box();
			total_width += child_box.width;
		}
		total_width -= node_gui.children[0].get_box().p_left;
		total_width -= node_gui.children[node_gui.children.length - 1].get_box().p_right;
		total_width += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_x = x - total_width * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_x += (child.width * .5);
			if (i > 0) {
				child_x += child_box.p_left;
			}
			child_y = line_y + this.size + (child.height * .5) + child_box.p_top;
			path += "M " + child_x + " " + line_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			child_x += (child.width * .5) + child_box.p_right + this.spacing;
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
	
}) (SKOOKUM.SM.NodeLayout["DownTree"].prototype);