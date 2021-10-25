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
                await knexSQlite3('productos').insert(productoParaAgregar);
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
                await knexSQlite3('productos').select('*').where('id', '=', id).update(productoActualizado);
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
                await knexSQlite3('productos').where('id', '=', id).del();
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