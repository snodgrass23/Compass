require('express');


var server = express.createServer(
	express.staticProvider(__dirname + '/static')
);

server.get('/download', function(req, res){
	res.send('Downloading!');
});

server.listen(3000);