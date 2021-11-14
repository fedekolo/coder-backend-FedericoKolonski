const mongoose = require('mongoose');
const usuariosCollection = 'usuarios';

const UsuarioEsquema = mongoose.Schema({
    usuario: {type: String, require: true, minLength: 1, maxLenghth: 50},
    contrasena: {type: String, require: true, minLength: 1, maxLenghth: 50},
    correo: {type: String, require: true, minLength: 1, maxLenghth: 50}
});

const Usuario = mongoose.model(usuariosCollection, UsuarioEsquema);

module.exports = Usuario;