/**
 * Module dependencies.
 */

var PORT = 3333;

var express = require('express'),
        routes = require('./routes'),
        socket = require('./routes/socket.js'),
        mongoose = require('mongoose');

var SampleData = require('./model/sample-data.js');
var Musica = require('./model/musica.js');
var Artista = require('./model/artista.js');

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
mongoose.connect('mongodb://localhost/testeSocket8');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conexao com mongodb error:'));
db.once('open', function (callback) {
    console.log('conexao com mongodb realizada com sucesso');

    //populando o banco se nao houver dados
    Artista.find({}, function (err, artistas) {
        if (err)
            throw err;

        if (artistas.length === 0) {

            var novoArtista = Artista({
                nome: SampleData[0].nome
            });

            novoArtista.save(function (err, artista) {
                if (err)
                    throw err;
                
                for (var m = 0; m < SampleData[0].musicas.length; m++) {
                    var musica = SampleData[0].musicas[m];

                    var novaMusica = Musica({
                        titulo: musica.titulo,
                        ano: musica.ano,
                        autor: musica.autor,
                        votos: 0,
                        artista: artista._id
                    });
                    
                    console.log(novaMusica);

                    novaMusica.save(function (err) {
                        if (err)
                            throw err;
                    });
                }
            });
        }
    });
});

// Start server
app.listen(PORT, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
