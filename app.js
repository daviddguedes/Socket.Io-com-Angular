/**
 * Module dependencies.
 */

var PORT = 3333;

var express = require('express'),
        routes = require('./routes'),
        socket = require('./routes/socket.js'),
        Musica = require('./model/musica.js'),
        mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Hook Socket.io into Express
var io = require('socket.io').listen(app);

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket);
io.sockets.on('connect', function () {
    console.log('Socket is connected.');
});
io.sockets.on('disconnect', function () {
    console.log('Socket is disconnected.');
});
io.sockets.on('reconnect', function () {
    console.log('Socket connection restored.');
});
io.sockets.on('reconnecting', function (nextRetry) {
    console.log('Socket trying to reconnect.');
});
io.sockets.on('reconnect_failed', function () {
    console.log("Socket reconnect failed");
});

//Connect mongodb
mongoose.connect('mongodb://localhost/testeSocket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conexao com mongodb error:'));
db.once('open', function (callback) {
    console.log('conexao com mongodb realizada com sucesso');
});

// Start server
app.listen(PORT, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
