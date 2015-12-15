var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var musicaSchema = new Schema({
    nomeMusica: String,
    votos: Number
});

var Musica = mongoose.model('Musica', musicaSchema);

module.exports = Musica;