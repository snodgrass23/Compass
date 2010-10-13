;(function($, Raphael, SM) {


function Project() {
  var default_structure = {       // This is the format of saving/loading a project as JSON (jsonREF, preserving object references)
    name: "Unnamed Project",
    tree: {
      title: "Start Here",
      children: []
    },
    views: [
      {
        name: "Main",
        root_node: null,
        focus: {x: 0, y: 0},
        node_guis: [{
          data: null,
          layout: "TreeDown"
        }]
      }
    ]
  };
  default_structure.views[0].root_node = default_structure.views[0].node_guis[0].data = default_structure.tree;
  
  this.data = new SKOOKUM.SM.NodeData(default_structure.tree);
  this.views = default_structure.views;
}

Project.prototype = {

  load_json: function(json) {    
    $(this).trigger('project-load', [this.json]);
  },
  
  nodes_breadth_first: function() {
    // return nodes breadth first
  },
  
  get_node_with_id: function(id) {
    return this.lookup_table[id];
  }
  
};

SM.Project = Project;


})(jQuery, Raphael, SKOOKUM.SM);
