;(function($, Raphael, SM) {


function Project() {
  var default_structure = {       // This is the format of saving/loading a project as JSON (jsonREF, preserving object references)
    name: "Unnamed Project",
    tree: {
      title: "Start Here",
      layouts: ["TreeDown"],
      colors: [null],
      children: []
    },
    views: [
      {
        name: "Main",
        root_node: null,
        colors: null,
        offset: {x: 0, y: 0}
      }
    ]
  };
  
  this.build_model(default_structure);
}

Project.prototype = {

  build_model: function(structure) {
    this.data = new SKOOKUM.SM.NodeData(structure.tree);
    this.views = structure.views;
  },

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
