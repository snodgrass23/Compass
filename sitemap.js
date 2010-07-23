var app = require('express').createServer();

app.get('/', function(req, res){
	res.render('index.haml', {
		
	});
});

app.listen(3000);