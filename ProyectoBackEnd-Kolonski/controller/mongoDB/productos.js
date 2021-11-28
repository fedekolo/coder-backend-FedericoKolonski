// CONFIG INICIAL
const Producto = require('../../bd/mongoDB/models/productos');
const moment = require('moment');
const conexionMongoDB = require('../../bd/mongoDB/conexionDB');
const mongoose = require('mongoose');

// FUNCIONES
class Productos {
    constructor (bd) {
        this.bd = bd;
    }

    async listar() {
        try {
            await conexionMongoDB();
            const productosFiltrados = await Producto.find({});
            mongoose.disconnect();
            return productosFiltrados==undefined ? {error: 'No hay productos'} : productosFiltrados;
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async listarId(id) {
        try {
            await conexionMongoDB();
            const productoFiltrado = await Producto.find({id: id});
            mongoose.disconnect();
            return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado[0];
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async agregar(productoBody) {
        
        try {
            await conexionMongoDB();
            const productoParaAgregar = {
                id: Math.round(Math.random() * (1000000 - 1) + 1),
                timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
                nombre: productoBody.nombre,
                descripcion: productoBody.descripcion,
                codigo: productoBody.codigo,
                foto: productoBody.foto,
                precio: productoBody.precio,
                stock: productoBody.stock
            };
            await Producto(productoParaAgregar).save();
            mongoose.disconnect();
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async actualizar(id,productoBody) { 

        try {
            conexionMongoDB();     
            const productoActualizado = {
                id: id,
                timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
                nombre: productoBody.nombre,
                descripcion: productoBody.descripcion,
                codigo: productoBody.codigo,
                foto: productoBody.foto,
                precio: productoBody.precio,
                stock: productoBody.stock
            };
            await Producto.updateOne({id: id}, {$set: productoActualizado});
            mongoose.disconnect();
            return productoActualizado;
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async borrar(id) {
        try {
            await conexionMongoDB();  
            await Producto.deleteOne({id: id});
            mongoose.disconnect();
            return;
        } catch (err) {
            console.log('Error en proceso:', err);
        }    
    }

}

module.exports = Productos;