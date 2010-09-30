SKOOKUM.SM.NodeLayout.create("ListDown",
	function(node_gui) {
		if (node_gui.children.length === 0) {
			return;
		}
			
		var total_width,
			child_x, child_y,
			last_y,
			child_box = {pad: {} },
			x, y,
			data,
			i,
			path;
		
		x = node_gui.x;
		y = node_gui.y;
		data = node_gui.data;
				
		last_y = y + (node_gui.height * .5);
		child_box.pad.bottom = 0; 
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_y = last_y + child_box.pad.bottom + this.spacing;
			child_box = child.get_box();			
			child_y += child_box.pad.top + child.height * .5;
			child_x = x + this.spacing + child_box.pad.left + child.width * .5;
			path += "M " + x + " " + child_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			last_y = child_y + child.height * .5;
		}
		
		path += "M " + x + " " + y + " ";
		path += "L " + x + " " + child_y + " ";
		
		if(data.parent) {						// "Not Root"
			node_gui.set_path_str(path);
		}
	}
);