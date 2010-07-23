var app = require('express').createServer();

app.get('/', function(req, res){
	res.render('client/index.html', {
		
	});
});

app.listen(3000);