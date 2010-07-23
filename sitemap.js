
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect');

// Create and export Express app

var app = express.createServer();

// Configuration

app.configure(function(){
    /*app.set('views', __dirname + '/views');*/
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.compiler({ src: __dirname + '/static', enable: ['sass'] }));
    app.use(connect.staticProvider(__dirname + '/static'));
});

app.configure('development', function(){
    app.set('reload views', 1000);
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

// Routes

app.get('/download', function(req, res){
    res.send('Downloading!');
});

app.listen(3000);
