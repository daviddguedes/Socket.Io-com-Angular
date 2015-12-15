var votacaoList = [];
var artistasLista = [
    {
        nome: 'Roberto Carlos',
        musicas: [
            {
                titulo: 'Detalhes',
                ano: '1984',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'Como é grande o meu amor',
                ano: '1986',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'O Calhambeque',
                ano: '1979',
                autor: 'Erasmo Carlos'
            },
            {
                titulo: 'Estrada de Santos',
                ano: '1976',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'Debaixo dos caracóis',
                ano: '1974',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'O Terço',
                ano: '1986',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'Mulher de 40',
                ano: '1994',
                autor: 'Roberto Carlos'
            },
            {
                titulo: 'Amigo',
                ano: '1979',
                autor: 'Roberto Carlos e Erasmo Carlos'
            }
        ]
    }
];
module.exports = function (socket) {
    Musica.find({}, function (err, users) {
        if (err)
            throw err;

        // object of all the users
        console.log(users);
    });
    socket.emit('init', {artistas: artistasLista, votacao: votacaoList});

    socket.on('votacao', function (data) {
        console.log('capturando voto em: ' + data.musica);

        var nome_musica = data.musica;
        var flag = false;

        if (votacaoList.length === 0) {
            votacaoList.push({titulo: nome_musica, votos: 1});
        } else {
            for (var i = 0; i < votacaoList.length; i++) {
                var elemento = votacaoList[i];
                if (elemento.titulo == nome_musica) {
                    var v = elemento.votos + 1;
                    var el = {titulo: elemento.titulo, votos: v};
                    votacaoList.splice(votacaoList.indexOf(elemento), 1);
                    votacaoList.push(el);
                    votacaoList.sort(function (a, b) {
                        return b.votos - a.votos;
                    });
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                votacaoList.push({titulo: nome_musica, votos: 1});
            }
        }
        console.log('enviando o objeto via broadcast emit "votacao"');
        console.log(votacaoList);
        socket.emit('votacao', {votacao: votacaoList});
        socket.broadcast.emit('votacao', {votacao: votacaoList});
    });
};
