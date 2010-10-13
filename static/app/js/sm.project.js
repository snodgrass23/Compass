;(function($, Raphael, SM) {


function Project() {
  this.data = {
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
  this.data.views[0].root_node = this.data.views[0].node_guis[0].data = this.data.tree;
}

Project.prototype = {

  load_json: function(json) {
        
    // Here, build pointer mappings between each node in views[*].nodes[*] and their corresponding tree data entries for faster lookups
    
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
