// export function for listening to the socket
module.exports = function (socket) {
  // broadcast o status da votação
  socket.on('votacao', function (data) {
    socket.broadcast.emit('votacao', data.totalVotos);
  });
  
  // Avisa quando um usuário desconectou
  socket.on('disconnect', function () {
    socket.broadcast.emit(console.log('Desconectado'));
  });
};
