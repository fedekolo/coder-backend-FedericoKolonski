const mongoose = require('mongoose');
const mensajesCollection = 'mensajes';

const MensajeEsquema = mongoose.Schema({
    mail: {type: String, require: true, minLength: 5, maxLenghth: 50},
    mensaje: {type: String, require: true, minLength: 1, maxLenghth: 300},
    fechaHora: {type: String, require: true, minLength: 1, maxLenghth: 50}
});

const Mensaje = mongoose.model(mensajesCollection, MensajeEsquema);

module.exports = Mensaje;