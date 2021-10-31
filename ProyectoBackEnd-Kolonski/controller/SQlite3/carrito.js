// CONFIG INICIAL
const {optionsSQlite3} = require('../../bd/SQlite3/SQlite3');
const knexSQlite3 = require('knex')(optionsSQlite3);
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
                const productoFiltrado = await knexSQlite3('carrito').select('*').where('id', '=', id);
                return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

    async agregar(id) {
        (async () => {
            try {
                const productoFiltrado = await knexSQlite3('productos').select('*').where('id', '=', id);
                productoFiltrado.timestamp = moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a');
                await knexSQlite3('carrito').insert(productoFiltrado);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

    async borrar(id) {
        (async () => {
            try {
                await knexSQlite3('carrito').where('id', '=', id).del();
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

}

module.exports = Carrito;