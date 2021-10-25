const mongoose = require('mongoose');
const carritoCollection = 'carrito';

const productoCarritoEsquema = mongoose.Schema({
    title: {type: String, require: true, minLength: 1, maxLenghth: 50},
    price: {type: Number, require: true, minLength: 1, maxLenghth: 15},
    thumbnail: {type: String, require: true, minLength: 1, maxLenghth: 50},
    id: {type: Number, require: true, minLength: 1, maxLenghth: 10},
    timestamp: {type: String, require: true, minLength: 1, maxLenghth: 50},
    descripcion: {type: String, require: true, minLength: 1, maxLenghth: 100},
    codigo: {type: Number, require: true, minLength: 1, maxLenghth: 20},
    stock: {type: Number, require: true, minLength: 1, maxLenghth: 10}

});

const ProductoCarrito = mongoose.model(carritoCollection, productoCarritoEsquema);

module.exports = ProductoCarrito;