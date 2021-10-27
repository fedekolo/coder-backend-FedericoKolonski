// CONFIG INICIAL
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
            const doc = this.bd.doc(`${id}`);
            const item = await doc.get();
            const productoFiltrado = item.data();
            return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async agregar(productoBody) {
        const productoParaAgregar = {
            id: this.bd.length+1,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            title: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            thumbnail: productoBody.foto,
            price: productoBody.precio,
            stock: productoBody.stock
        };

        try {
            const doc = this.bd.doc(`${id}`);
            await doc.create(productoParaAgregar);
            return;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async actualizar(id,productoBody) {      
        const productoActualizado = {
            id: id,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            title: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            thumbnail: productoBody.foto,
            price: productoBody.precio,
            stock: productoBody.stock
        };

        try {
            const doc = this.bd.doc(`${id}`);
            await doc.update(productoActualizado);
            return;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    }

    async borrar(id) {
        try {
            const doc = this.bd.doc(`${id}`);
            await doc.delete();
            return;
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }    
    }

}

module.exports = Carrito;