var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistaSchema = new Schema({
    nome: String
});

module.exports = mongoose.model('Artista', artistaSchema);