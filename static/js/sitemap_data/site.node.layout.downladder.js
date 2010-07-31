// 	Straight down:

/*
     |
     o
	 |
     o
	 |
	 o
*/

SKOOKUM.SM.NodeLayout["DownLadder"] = function() {};
SKOOKUM.SM.NodeLayout["DownLadder"].prototype = new SKOOKUM.SM.NodeLayout.Base();

(function (proto) {

	proto.apply_to = function(node_gui) {
		if (node_gui.children.length === 0) {
			return;
		}
			
		var total_width,
			child_x, child_y,
			last_y,
			child_box,
			x, y,
			data,
			i,
			path;
		
		x = node_gui.x;
		y = node_gui.y;
		data = node_gui.data;
				
		child_x = x;
		last_y = y + (node_gui.height * .5);
		
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_y = last_y + this.spacing;
			path += "M " + child_x + " " + last_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y + (child.height * .5));
			last_y = child_y + child.height;
		}
		
		if(data.parent) {						// "Not Root"
			node_gui.set_path_str(path);
		}
	};	
	
}) (SKOOKUM.SM.NodeLayout["DownLadder"].prototype);