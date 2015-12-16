var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//dependencia
var Artista = require('../model/artista.js');

var musicaSchema = new Schema({
    titulo: String,
    ano: Number,
    autor: String,
    votos: Number,
    artista: {type: Number, ref: 'Artista'}
});

module.exports = mongoose.model('Musica', musicaSchema);