SKOOKUM.SM.NodeLayout.create("DoubleRight",
	function(node_gui) {
		if (node_gui.children.length === 0) {
			return;
		}
			
		var total_height,
			child_x, child_y,
			next_y,
			parent_x, line_x,
			top_node, bottom_node,
			child_box, 
			x, y,
			data,
			i,
			path;
		
		x = node_gui.x;
		y = node_gui.y;
		data = node_gui.data;
		
		parent_x = x + (node_gui.width * .5);
		line_x = parent_x + this.size;
		path = "M " + x + " " + y + " L " + line_x + " " + y + " " ;
		
		total_height = 0;
		for (i in node_gui.children) {
			if (i % 2) {
				child_box = node_gui.children[i].get_box();
				total_height += child_box.height;
			}
		}
		total_height -= node_gui.children[0].get_box().pad.top;
		total_height -= node_gui.children[node_gui.children.length - 1].get_box().pad.bottom;
		total_height += ( this.spacing * (node_gui.children.length - 1) );
		
		child_y = y - total_height * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			if (i > 0) {
				child_y += child_box.pad.top;
			}
			if (!(i % 2)) {
				child_y += (child.height * .5);			
				child_x = line_x + this.size + (child.width * .5) + child_box.pad.left;
			}
			else {
				child_x = line_x + this.size + (child.width * .5) + child_box.pad.left + 150;	// change to a max_width calculation
			}
			path += "M " + line_x + " " + child_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			if (!(i %2)) {
				child_y += (child.height * .5) + child_box.pad.bottom + this.spacing;
			}
			else {
				child_y += 
			}
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
	}	
);