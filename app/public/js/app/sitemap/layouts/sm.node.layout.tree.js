SKOOKUM.SM.NodeLayout.create("TreeDown",
	function(node_gui) {
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
		total_width -= node_gui.children[0].get_box().pad.left;
		total_width -= node_gui.children[node_gui.children.length - 1].get_box().pad.right;
		total_width += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_x = x - total_width * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_x += (child.width * .5);
			if (i > 0) {
				child_x += child_box.pad.left;
			}
			child_y = line_y + this.size + (child.height * .5) + child_box.pad.top;
			path += "M " + child_x + " " + line_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			child_x += (child.width * .5) + child_box.pad.right + this.spacing;
		}
		if(node_gui.children.length > 1) {
			left_node = node_gui.children[0];
			right_node = node_gui.children[data.children.length - 1];
			path += "M " + left_node.x + " " + line_y + " ";
			path += "L " + right_node.x + " " + line_y + " ";
		}			
		node_gui.set_path_str(path);
	}
);

SKOOKUM.SM.NodeLayout.create("TreeRight",
	function(node_gui) {
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
		path = "M " + x + " " + y + " L " + line_x + " " + y + " " ;
		
		// Find WIDTH of all children together with spacing
		total_height = 0;
		for (i in node_gui.children) {
			child_box = node_gui.children[i].get_box();
			total_height += child_box.height;
		}
		total_height -= node_gui.children[0].get_box().pad.top;
		total_height -= node_gui.children[node_gui.children.length - 1].get_box().pad.bottom;
		total_height += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_y = y - total_height * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_y += (child.height * .5);
			if (i > 0) {
				child_y += child_box.pad.top;
			}
			child_x = line_x + this.size + (child.width * .5) + child_box.pad.left;
			path += "M " + line_x + " " + child_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			child_y += (child.height * .5) + child_box.pad.bottom + this.spacing;
		}
		if(node_gui.children.length > 1) {
			top_node = node_gui.children[0];
			bottom_node = node_gui.children[data.children.length - 1];
			path += "M " + line_x + " " + top_node.y + " ";
			path += "L " + line_x + " " + bottom_node.y + " ";
		}			
			node_gui.set_path_str(path);

	}	
);