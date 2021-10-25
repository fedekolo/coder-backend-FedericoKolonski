// CONFIG INICIAL
const {optionsMariaDB} = require('../../bd/mariaDB/mariaDB');
const knexMariaDB = require('knex')(optionsMariaDB);
const moment = require('moment');

// FUNCIONES
class Carrito {
    constructor (bd) {
        this.bd = bd;
    }

    async listar() {
        return this.bd;
    }

    async listarId(id) {
        (async () => {
            try {
                const productoFiltrado = await knexMariaDB('carrito').select('*').where('id', '==', id);
                return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    async agregar(id) {
        (async () => {
            try {
                const productoFiltrado = await knexMariaDB('productos').select('*').where('id', '==', id);
                productoFiltrado.timestamp = moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a');
                await knexMariaDB('carrito').insert(productoFiltrado);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    async borrar(id) {
        (async () => {
            try {
                await knexMariaDB('carrito').where('id', '=', id).del();
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

}

module.exports = Carrito;