// CONFIG INICIAL
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
            const doc = this.bd.doc(`${id}`);
            const item = await doc.get();
            const productoFiltrado = item.data();
            return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
        } catch (err) {
            console.log("Ha habido un error");
        }
    }

    async agregar(productoBody) {
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

        try {
            const admin = require("firebase-admin");
            const conexionFirebase = require('../../bd/firebase/firebase');
            conexionFirebase();
            const firestore = admin.firestore();
            const collection = await firestore.collection('productos');
            const doc = collection.doc();
            await doc.create(productoParaAgregar);
        } catch (err) {
            console.log("Ha habido un error",err);
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
            console.log("Ha habido un error");
        }
    }

    async borrar(id) {
        try {
            await Producto.deleteOne({id: id});
            return;
        } catch (err) {
            console.log("Ha habido un error");
        }    
    }

}

module.exports = Productos;