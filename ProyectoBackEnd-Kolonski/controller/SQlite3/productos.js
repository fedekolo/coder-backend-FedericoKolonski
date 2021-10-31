// CONFIG INICIAL
const {optionsSQlite3} = require('../../bd/SQlite3/SQlite3');
const knexSQlite3 = require('knex')(optionsSQlite3);
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
                const productoFiltrado = await knexSQlite3('productos').select('*').where('id', '==', id);
                return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

    agregar(productoBody) {
        const productoParaAgregar = [{
            id: Math.round(Math.random() * (1000000 - 1) + 1),
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
                await knexSQlite3('productos').insert(productoParaAgregar);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

    actualizar(id,productoBody) {      
        const productoActualizado = {
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            nombre: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            foto: productoBody.foto,
            precio: productoBody.precio,
            stock: productoBody.stock,
            id: id
        };

        (async () => {
            try {
                await knexSQlite3('productos').select('*').where('id', '=', id).update(productoActualizado);
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

    borrar(id) {
        (async () => {
            try {
                await knexSQlite3('productos').where('id', '=', id).del();
                return;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();
    }

}

module.exports = Productos;