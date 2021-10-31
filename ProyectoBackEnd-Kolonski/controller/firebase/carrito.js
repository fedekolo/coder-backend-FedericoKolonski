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
            console.log("Ha habido un error",err);
        }
    }

    async agregar(id) {
        try {
            const admin = require("firebase-admin");
            const conexionFirebase = require('../../bd/firebase/firebase');
            conexionFirebase();
            const firestore = admin.firestore();
            const collection = firestore.collection('productos');
            const querySnapshot = collection.doc(`${id}`);
            const item = await querySnapshot.get();
            const productoFiltrado = item.data();
            const collectionCarrito = firestore.collection('carrito');
            const bdCarrito = collectionCarrito.doc();
            await bdCarrito.create(productoFiltrado);
            return;
        } catch (err) {
            console.log("Ha habido un error",err);
        }
    }

    async borrar(id) {
        try {
            const admin = require("firebase-admin");
            const conexionFirebase = require('../../bd/firebase/firebase');
            conexionFirebase();
            const firestore = admin.firestore();
            const collectionCarrito = firestore.collection('carrito');
            const querySnapshot = collectionCarrito.doc(`${id}`);
            await querySnapshot.delete();
            return;
        } catch (err) {
            console.log("Ha habido un error",err);
        }    
    }

}

module.exports = Carrito;