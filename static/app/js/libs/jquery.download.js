$.download = function(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		//data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var form = $('<form action="'+ url +'" method="'+ (method||'post') +'"></form>');
		for (var key in data) {
			new_input = $('<input type="hidden" name="'+ key +'" value="" />').val(data[key]); 
			form.append(new_input)
		}
		//send request
		form.appendTo('body').submit().remove();
	};
};