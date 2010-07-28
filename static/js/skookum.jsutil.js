var SKOOKUM = (function() {

	var typeOf = function(value) {
	    var s = typeof value;
	    if (s === 'object') {
	        if (value) {
	            if (typeof value.length === 'number' &&
	                    !(value.propertyIsEnumerable('length')) &&
	                    typeof value.splice === 'function') {
	                s = 'array';
	            }
	        } else {
	            s = 'null';
	        }
	    }
	    return s;
	};
	
	return SKOOKUM || {		// Don't overwrite existing SKOOKUM namespace if it's already been built
	
		typeOf: typeOf,
		
		introspect: function(obj, name) {
			name = name || "(no name given)";
			var props = [],
				meths = [];
			for (var prop in obj) {
				if(SKOOKUM.typeOf(obj[prop] !== "undefined")) {
					if(SKOOKUM.typeOf(obj[prop]) === "function") {
						meths.push(prop);
					}
					else {
						props.push(prop);
					}
				}
			}
			meths.sort();
			props.sort();
			return ("\ntypeOf(" + name + ") is " + SKOOKUM.typeOf(obj) + "\n" + name + " methods: " + meths.join(', ') + "\n\n" + name + " properties: " + props.join(', ') + "\n");
		},
		
		log: function(msg) {
			if (window.console) {
				console.log("%o", msg);
			}
		},
		
		getTicks: function() {
			return (new Date()).getTime();
		}

	};

}) ();