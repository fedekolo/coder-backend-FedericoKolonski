// CONFIG INICIAL
const ProductoCarrito = require('../../bd/mongoDB/models/carrito');
const moment = require('moment');

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
            await ProductoCarrito(productoParaAgregar).save();
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
            await ProductoCarrito.updateOne({id: id}, {$set: productoActualizado});
            return productoActualizado;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async borrar(id) {
        try {
            await ProductoCarrito.deleteOne({id: id});
            return;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }    
    }

}

module.exports = Carrito;