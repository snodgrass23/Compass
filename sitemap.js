var app = require('express').createServer();

app.get('/', function(req, res){
    res.send('Basic site up, deployment scripts working!');
});

app.listen(3000);