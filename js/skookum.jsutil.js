function typeOf(value) {
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
}


function introspect(name, obj) {
	var props = [],
		meths = [];
	for (var prop in obj) {
		if(typeOf(obj[prop] !== "undefined")) {
			if(typeOf(obj[prop]) === "function") {
				meths.push(prop);
			}
			else {
				props.push(prop);
			}
		}
	}
	meths.sort();
	props.sort();
	return ("\ntypeOf(" + name + ") is " + typeOf(obj) + "\n" + name + " methods: " + meths.join(', ') + "\n\n" + name + " properties: " + props.join(', ') + "\n");
}


jQuery.log = jQuery.fn.log = function (msg) {
      if (window.console){
         console.log("%o", msg, this);
      }
      return this;
};
