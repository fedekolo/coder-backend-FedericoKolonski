// CONFIG INICIAL
const {optionsMariaDB} = require('../../bd/mariaDB/mariaDB');
const knexMariaDB = require('knex')(optionsMariaDB);
const moment = require('moment');

// FUNCIONES
class Productos {
    constructor (bd) {
        this.bd = bd;
    }

    listar() {
        return this.bd;
    }

    listarId(id) {
        (async () => {
            try {
                const productoFiltrado = await knexMariaDB('productos').select('*').where('id', '==', id);
                return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    guardar(productoBody) {
        const productoParaAgregar = [{
            id: this.bd.length+1,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            nombre: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            foto: productoBody.foto,
            precio: productoBody.precio,
            stock: productoBody.stock
        }];

        (async () => {
            try {
                await knexMariaDB('productos').insert(productoParaAgregar);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    actualizar(id,productoBody) {      
        const productoActualizado = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        };

        (async () => {
            try {
                await knexMariaDB('productos').select('*').where('id', '=', id).update(productoActualizado);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    borrar(id) {
        (async () => {
            try {
                await knexMariaDB('productos').where('id', '=', id).del();
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

}

module.exports = Productos;