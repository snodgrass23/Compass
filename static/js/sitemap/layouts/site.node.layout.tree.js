// 	Branching Down and then out:

/*
     |
   ~~~~~
   | | |
   o o o
*/

SKOOKUM.SM.NodeLayout["Tree"] = function() {};
SKOOKUM.SM.NodeLayout["Tree"].prototype = new SKOOKUM.SM.NodeLayout.Base();

(function (proto) {

	proto.name = "Tree";
	
	proto.apply_to = function(node_gui, dir_options) {
		if (node_gui.children.length === 0) {
			return;
		}
		
		dir_options = dir_options || {
			wname: "width",
			hname: "height",
			xname: "x",
			yname: "y",
			lname: "left",
			rname: "right",
			tname: "top",
			bname: "bottom"
		};
		
		var	wname = dir_options.wname;
			hname = dir_options.hname;
			xname = dir_options.xname;
			yname = dir_options.yname;
			lname = dir_options.lname;
			rname = dir_options.rname;
			tname = dir_options.tname;
			bname = dir_options.bname;
			
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
		x = node_gui[xname];
		y = node_gui[yname];
		data = node_gui.data;
		
		// Find Y of all children (will be the same)
		parent_y = y + (node_gui[hname] * .5);
		line_y = parent_y + this.size;
		path = "M " + x + " " + parent_y + " L " + x + " " + line_y + " " ;
		
		// Find WIDTH of all children together with spacing
		total_width = 0;
		for (i in node_gui.children) {
			child_box = node_gui.children[i].get_box();
			total_width += child_box[wname];
		}
		total_width -= node_gui.children[0].get_box().pad[lname];
		total_width -= node_gui.children[node_gui.children.length - 1].get_box().pad[rname];
		total_width += ( this.spacing * (node_gui.children.length - 1) );
		
		// Loop through children, positioning each
		child_x = x - total_width * .5;
		for (var i = 0; i < node_gui.children.length; i++) {
			var child = node_gui.children[i];
			child_box = child.get_box();
			child_x += (child[wname] * .5);
			if (i > 0) {
				child_x += child_box.pad[lname];
			}
			child_y = line_y + this.size + (child[hname] * .5) + child_box.pad[tname];
			path += "M " + child_x + " " + line_y + " ";
			path += "L " + child_x + " " + child_y + " ";
			child.move_to_with_children(child_x, child_y);
			child_x += (child[wname] * .5) + child_box.pad[rname] + this.spacing;
		}
		if(node_gui.children.length > 1) {
			left_node = node_gui.children[0];
			right_node = node_gui.children[data.children.length - 1];
			path += "M " + left_node.x + " " + line_y + " ";
			path += "L " + right_node.x + " " + line_y + " ";
		}			
		if(data.parent) {						// "Not Root"
			//node_gui.set_path_str(path);
		}
	};	
	
}) (SKOOKUM.SM.NodeLayout["DownTree"].prototype);