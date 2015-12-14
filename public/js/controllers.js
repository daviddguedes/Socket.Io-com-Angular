'use strict';

/* Controllers */

function VotacaoCtrl($scope, socket) {
    $scope.artista = [];
    $scope.votadas = [];

    socket.on('init', function (data) {
        $scope.artista = data.artistas;
        $scope.votadas = data.votacao;
    });

    $scope.musicaVotada = function (musica) {
        console.log('enviando voto para: ' + musica.titulo);
        socket.emit('votacao', {
            musica: musica.titulo
        });
    };

    socket.on('votacao', function (data) {
        $scope.votadas = data.votacao;
    });
    
    socket.on('connect', function () {
        console.log('Socket is connected.');
    });
    
    socket.on('disconnect', function () {
        console.log('Socket is disconnected.');
    });
}