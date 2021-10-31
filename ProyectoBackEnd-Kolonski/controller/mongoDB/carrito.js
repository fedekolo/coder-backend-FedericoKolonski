// CONFIG INICIAL
const ProductoCarrito = require('../../bd/mongoDB/models/carrito');
const Producto = require('../../bd/mongoDB/models/productos');
const moment = require('moment');
const conexionMongoDB = require('../../bd/mongoDB/conexionDB');
const mongoose = require('mongoose');

// FUNCIONES
class Carrito {
    constructor (bd) {
        this.bd = bd;
    }

    listar() {
        return this.bd;
    }

    async listarId(id) {
        try {
            const productoFiltrado = await ProductoCarrito.find({id: id});
            return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async agregar(id) {
        conexionMongoDB();
        try {
            const productoFiltrado = await Producto.find({id: id});
            await ProductoCarrito(productoFiltrado).save();
            mongoose.disconnect();
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async borrar(id) {
        conexionMongoDB();
        try {
            await ProductoCarrito.deleteOne({id: id});
            mongoose.disconnect();
            return;
        } catch (err) {
            console.log('Error en proceso:', err);
        }    
    }

}

module.exports = Carrito;