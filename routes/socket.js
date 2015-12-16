var async = require('async');

module.exports = function (socket) {
    console.log('iniciando o socket no servidor');
    var Musica = require('../model/musica.js');
    var Artista = require('../model/artista.js');
    var artistasList = [];
    var votacaoList = [];

    async.parallel({
        artistas: function (callback) {
            Artista.find({}, function (err, docs) {
                callback(err, docs);
            });
        },
        musicas: function (callback) {
            Musica.find({}, function (err, docs) {
                callback(err, docs);
            });
        }
    }, function (e, r) {

        artistasList = r.musicas;

        for (var m = 0; m < r.musicas.length; m++) {
            var musica = r.musicas[m];
            votacaoList.push({titulo: musica.titulo, votos: musica.votos});
        }

        socket.emit('init', {artistas: artistasList, votacao: votacaoList});
    });


    socket.on('votacao', function (data) {
        console.log('capturando voto em: ' + data.musica);

        Musica.findOneAndUpdate({titulo: data.musica}, {$inc: {votos: 1}})
                .exec(function (err) {
                    if (err) {
                        throw err;
                    }

                    Musica.find({}, function (err, musicas) {
                        if (err) {
                            throw err;
                        }
                        
                        var votacaoList = [];

                        for (var m = 0; m < musicas.length; m++) {
                            var musica = musicas[m];
                            votacaoList.push({titulo: musica.titulo, votos: musica.votos});
                        }

                        console.log('enviando o objeto via broadcast emit "votacao"');
                        //console.log(votacaoList);
                        socket.emit('votacao', {votacao: votacaoList});
                        socket.broadcast.emit('votacao', {votacao: votacaoList});
                    });

                });
    });
}