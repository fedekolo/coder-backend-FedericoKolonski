// CONFIG INICIAL
const express = require('express');
const router = express.Router();

// CONEXION CON BD FACTORY
const bdSeleccionada = 3; 
// const Carrito = require('../controller/fs/carrito');
// const controller = new Carrito('./bd/fs/carrito.txt');

const bdConfig = async (bdSeleccionada) => {
    
    if (bdSeleccionada === 0) {
        // FILE SYSTEM

        const Carrito = require('../controller/fs/carrito');
        return new Carrito('../bd/fs/carrito.txt');

    } else if (bdSeleccionada === 1) {
        // MARIA DB

        const {optionsMariaDB} = require('../bd/mariaDB/mariaDB');
        const knexMariaDB = require('knex')(optionsMariaDB);
        (async ()=>{
            try {
                // creo la tabla de productos en el caso de no existir
                await knexMariaDB.schema.hasTable('carrito').then((exists) => {
                    if (!exists) {
                      return knexMariaDB.schema.createTable('carrito', (table) => {
                        table.string('title'),
                        table.string('description'),
                        table.integer('codigo'),
                        table.integer('price'),
                        table.string('thumbnail'),
                        table.integer('stock'),
                        table.integer('id')
                      });
                    }
                  });
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexMariaDB.destroy();
            }
        })();

        const Carrito = require('../controller/mariaDB/carrito');
        const bdCarrito = await knexMariaDB.from('carrito').select('*');
        return new Carrito(bdCarrito);

    } else if (bdSeleccionada === 2) {
        // SQLITE3
        
        const {optionsSQlite3} = require('../bd/SQlite3/SQlite3');
        const knexSQlite3 = require('knex')(optionsSQlite3);
        (async ()=>{
            try {
                // creo la tabla de productos en el caso de no existir
                await knexSQlite3.schema.hasTable('carrito').then((exists) => {
                    if (!exists) {
                      return knexSQlite3.schema.createTable('carrito', (table) => {
                        table.string('title'),
                        table.string('description'),
                        table.integer('codigo'),
                        table.integer('price'),
                        table.string('thumbnail'),
                        table.integer('stock'),
                        table.integer('id')
                      });
                    }
                  });
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knexSQlite3.destroy();
            }
        })();

        const Carrito = require('../controller/SQlite3/carrito');
        const bdCarrito = await knexSQlite3.from('carrito').select('*');
        return new Carrito(bdCarrito);
    } else if (bdSeleccionada === 3) {
        // MONGODB

        const conexionMongoDB = require('../bd/mongoDB/conexionDB');
        conexionMongoDB();
        const Carrito = await require('../controller/mongoDB/carrito');
        const ProductoCarrito = require('../bd/mongoDB/models/carrito');
        const bdProductos = await ProductoCarrito.find().lean();
        return new Carrito(bdProductos);
    }

};

const controller = bdConfig(bdSeleccionada);

// RUTAS
router.get('/listar', async (req,res) => {
    console.log(controller)
    try {
        const productos = await controller.listar();
        res.json(productos);
    } catch (err) {
        res.status(err).send("Ha habido un error");
    }
});

router.get('/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const producto = await controller.listarId(params.id);
        res.json(producto);
    } catch (err) {
        res.status(err).send("Ha habido un error");
    }
});

router.post('/agregar/:id', async (req,res) => {
        try {
            const params = req.params;
            await controller.agregar(params.id);
            res.send('Producto agregado al carrito con éxito');
        }
        catch (err) {
            res.status(err).send("Ha habido un error");
        }
});

router.delete('/borrar/:id', async (req,res) => {
        try {
            const params = req.params;
            await controller.borrar(params.id);
            res.send('Producto eliminado con éxito');
        }
        catch (err) {
            res.status(err).send("Ha habido un error");
        }
});

module.exports = {router, bdSeleccionada};