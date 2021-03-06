const mongoose = require('mongoose');
const productosCollection = 'productos';

const ProductoEsquema = mongoose.Schema({
    title: {type: String, require: true, minLength: 1, maxLenghth: 50},
    price: {type: Number, require: true, minLength: 1, maxLenghth: 15},
    thumbnail: {type: String, require: true, minLength: 1, maxLenghth: 50},
    id: {type: Number, require: true, minLength: 1, maxLenghth: 10},
});

const Producto = mongoose.model(productosCollection, ProductoEsquema);

module.exports = Producto;