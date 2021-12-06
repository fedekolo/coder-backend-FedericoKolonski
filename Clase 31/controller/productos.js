// INICIADORES
const moment = require('moment');
const Producto = require('../models/productos');
const Mensaje = require('../models/mensajes');
const log4js = require('log4js');
const loggerError = log4js.getLogger('error');

// CONFIG DE PROCESOS
class Archivo {
    constructor (archivo) {
        this.archivo = archivo;
    }

    listar() {
        return this.archivo;
    }

    async guardar(productoBody) {
        const productoParaAgregar = {
            title: productoBody.title,
            price: parseInt(productoBody.price),
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length+1
        };

        try {
            await Producto(productoParaAgregar).save();
        }
    
        catch(e) {
            loggerError.error(e);
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
        }
    
        catch(e) {
            loggerError.error(e);
        }
    }

    async borrar(id) {
        try {
            await Producto.deleteOne({id: id});
        }
    
        catch(e) {
            loggerError.error(e);
        }

        const productoEliminado = this.archivo.filter(producto => producto.id==id);
        this.archivo = this.archivo.filter(producto => producto.id!=id);
        return productoEliminado;
    }

    async guardarMensaje(data) {
        const mensajeParaAgregar = {
            author: {
                id: data.mail,
                nombre: data.nombre,
                apellido: data.apellido,
                edad: data.edad,
                alias: data.alias,
                avatar: data.avatar
            },
            mensaje: data.mensaje,
            fechaHora: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a')
        };

        try {
            await Mensaje(mensajeParaAgregar).save();
        }
    
        catch(e) {
            loggerError.error(e);
        }
    }
};

module.exports = Archivo;