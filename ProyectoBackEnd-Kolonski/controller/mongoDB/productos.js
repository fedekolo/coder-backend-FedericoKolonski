// CONFIG INICIAL
const Producto = require('../../bd/mongoDB/models/productos');
const moment = require('moment');

// FUNCIONES
class Productos {
    constructor (bd) {
        this.bd = bd;
    }

    listar() {
        return this.bd;
    }

    async listarId(id) {
        try {
            const productoFiltrado = await Producto.find({id: id});
            return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async agregar(productoBody) {
        const productoParaAgregar = {
            id: Math.round(Math.random() * (1000000 - 1) + 1),
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            title: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            thumbnail: productoBody.foto,
            price: productoBody.precio,
            stock: productoBody.stock
        };

        try {
            await new Producto(productoParaAgregar).save();
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async actualizar(id,productoBody) {      
        const productoActualizado = [{
            id: id,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            title: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            thumbnail: productoBody.foto,
            price: productoBody.precio,
            stock: productoBody.stock
        }];

        try {
            await Producto.updateOne({id: id}, {$set: productoActualizado});
            return productoActualizado;
        } catch (err) {
            console.log('Error en proceso:', err);
        }
    }

    async borrar(id) {
        try {
            await Producto.deleteOne({id: id});
            return;
        } catch (err) {
            console.log('Error en proceso:', err);
        }    
    }

}

module.exports = Productos;