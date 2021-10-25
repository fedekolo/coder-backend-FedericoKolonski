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
            res.status(err).send("Ha habido un error");
        }
    }

    async guardar(productoBody) {
        const productoParaAgregar = [{
            id: this.bd.length+1,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            title: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            thumbnail: productoBody.foto,
            price: productoBody.precio,
            stock: productoBody.stock
        }];

        try {
            await Producto(productoParaAgregar).save();
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async actualizar(id,productoBody) {      
        const productoActualizado = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        };

        try {
            await Producto.updateOne({id: id}, {$set: productoActualizado});
            return productoActualizado;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async borrar(id) {
        try {
            await Producto.deleteOne({id: id});
            return;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }    
    }

}

module.exports = Productos;