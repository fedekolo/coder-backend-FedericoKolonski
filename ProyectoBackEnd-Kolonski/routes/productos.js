// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const server = require('../server'); 

// CONEXION CON BD FACTORY
const bdSeleccionada = 3; 
// const Carrito = require('../controller/fs/carrito');
// const controller = new Carrito('./bd/fs/carrito.txt');

const bdConfig = async (bdSeleccionada) => {
    
    if (bdSeleccionada === 0) {
        // FILE SYSTEM

        const Productos = require('../controller/fs/productos');
        return new Productos('../bd/fs/productos.txt');

    } else if (bdSeleccionada === 1) {
        // MARIA DB

        const {optionsMariaDB} = require('../bd/mariaDB/mariaDB');
        const knexMariaDB = require('knex')(optionsMariaDB);
        (async ()=>{
            try {
                // creo la tabla de productos en el caso de no existir
                await knexMariaDB.schema.hasTable('productos').then((exists) => {
                    if (!exists) {
                      return knexMariaDB.schema.createTable('productos', (table) => {
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
        const Productos = await require('../controller/mariaDB/productos');
        const bdProductos = await knexMariaDB.from('productos').select('*');
        return new Productos(bdProductos);
    } else if (bdSeleccionada === 2) {
        // SQLITE3

        const {optionsSQlite3} = require('../bd/SQlite3/SQlite3');
        const knexSQlite3 = require('knex')(optionsSQlite3);
        (async ()=>{
            try {
                // creo la tabla de productos en el caso de no existir
                await knexSQlite3.schema.hasTable('productos').then((exists) => {
                    if (!exists) {
                        return knexSQlite3.schema.createTable('productos', (table) => {
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
        const Productos = await require('../controller/SQlite3/productos');
        const bdProductos = await knexSQlite3.from('productos').select('*');
        return new Productos(bdProductos);
    } else if (bdSeleccionada === 3) {
        // MONGODB

        const conexionMongoDB = require('../bd/mongoDB/conexionDB');
        conexionMongoDB();
        const Productos = await require('../controller/mongoDB/productos');
        const Producto = require('../bd/mongoDB/models/productos');
        const bdProductos = await Producto.find().lean();
        return new Productos(bdProductos);
    }

};

const controller = bdConfig(bdSeleccionada);

// RUTAS
router.get('/listar', async (req,res) => {
    try {     
        const bd = await controller;
        const productos = await bd.listar();
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

router.post('/agregar', async (req,res) => {
    if (server.isAdmin) {
        try {
            const productoBody = req.body;
            const bd = await controller;
            await bd.agregar(productoBody);
            res.send('Producto agregado con éxito');
        }
        catch (err) {
            res.status(err).send("Ha habido un error");
        }
    } else {
        res.send('No puede ingresar a esta página');
    }

});

router.put('/actualizar/:id', async (req,res) => {
    if (server.isAdmin) {
        try {
            const params = req.params;
            const productoBody = req.body;
            await controller.actualizar(params.id,productoBody);
            res.send('Producto actualizado con éxito');
        } catch (err) {
            res.status(err).send("Ha habido un error");
        }
    } else {
        res.send('No puede ingresar a esta página');
    }

});

router.delete('/borrar/:id', async (req,res) => {
    if (server.isAdmin) {
        try {
            const params = req.params;
            await controller.borrar(params.id);
            res.send('Producto eliminado con éxito');
        }
        catch (err) {
            res.status(err).send("Ha habido un error");
        }
    } else {
        res.send('No puede ingresar a esta página');
    }
});

module.exports = {router};