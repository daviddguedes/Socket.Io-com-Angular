'use strict';

/* Controllers */

function VotacaoCtrl($scope, socket) {

  $scope.artista = [
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
        },
      ]
    }
  ] // $scope.artista
  
  socket.on('votacao', function (totalVotos) {
    $scope.votadas.push(totalVotos);
  });

  $scope.votadas = [];

  $scope.musicaVotada = function (musica) {

    if ($scope.votadas.length == 0) {
      var primeiroElemento = { titulo: musica.titulo, votos: 1 }
      $scope.votadas.push(primeiroElemento);
    } else {
      for (var i = 0; i < $scope.votadas.length; i++) {
        var elemento = $scope.votadas[i];
        if (elemento.titulo == musica.titulo) {
          var v = elemento.votos + 1;
          var el = { titulo: elemento.titulo, votos: v }
          $scope.votadas.splice($scope.votadas.indexOf(elemento), 1);
          $scope.votadas.push(el);
          $scope.votadas.sort(function (a, b) {
            return b.votos - a.votos;
          });
          return;
        }
      }

      var novoElemento = { titulo: musica.titulo, votos: 1 }
      $scope.votadas.push(novoElemento);

    }

    $scope.votadas.sort(function (a, b) {
      return b.votos - a.votos;
    });

    socket.emit('votacao', {
      totalVotos: $scope.votadas
    });

  } // $scope.musicaVotada()
  
  
}