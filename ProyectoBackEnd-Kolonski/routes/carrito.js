// CONFIG INICIAL
const express = require('express');
const router = express.Router();

// CONEXION CON BD FACTORY
const bdSeleccionada = 4; 

const bdConfig = async (bdSeleccionada) => {
    
    if (bdSeleccionada === 0) {
        // FILE SYSTEM

        const bdProductos = '../bd/fs/carrito.txt';
        return bdProductos;

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

        const bdCarrito = await knexMariaDB.from('carrito').select('*');
        return bdCarrito;

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

        const bdCarrito = await knexSQlite3.from('carrito').select('*');
        return bdCarrito;

    } else if (bdSeleccionada === 3) {
        // MONGODB

        const conexionMongoDB = require('../bd/mongoDB/conexionDB');
        conexionMongoDB();
        const ProductoCarrito = require('../bd/mongoDB/models/carrito');
        const bdProductos = await ProductoCarrito.find().lean();
        return bdProductos;

    } else if (bdSeleccionada === 4) {
        // FIREBASE

        const admin = require("firebase-admin");
        const conexionFirebase = require('../bd/firebase/firebase');
        conexionFirebase();
        const firestore = admin.firestore();
        const bdProductos = await firestore.collection('carrito');
        return bdProductos;
    }

};

const bdProductos = bdConfig(bdSeleccionada);

const controllerConfig = (bdSeleccionada) => {
    if (bdSeleccionada === 0) {
        const Carrito = require('../controller/fs/carrito');
        return Carrito;
    } else if (bdSeleccionada === 1) {
        const Carrito = require('../controller/mariaDB/carrito');
        return Carrito;
    } else if (bdSeleccionada === 2) {
        const Carrito = require('../controller/SQlite3/carrito');
        return Carrito;
    } else if (bdSeleccionada === 3) {
        const Carrito = require('../controller/mongoDB/carrito');
        return Carrito;
    } else if (bdSeleccionada === 4) {
        const Carrito = require('../controller/firebase/carrito');
        return Carrito;
    }
};

// RUTAS
router.get('/listar', async (req,res) => {
    try {
        const Carrito = controllerConfig(bdSeleccionada);
        const controller = new Carrito(bdProductos);
        const productos = await controller.listar();
        res.json(productos);
    } catch (err) {
        res.status(err).send("Ha habido un error");
    }
});

router.get('/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const Carrito = controllerConfig(bdSeleccionada);
        const controller = new Carrito(bdProductos);
        const producto = await controller.listarId(params.id);
        res.json(producto);
    } catch (err) {
        res.status(err).send("Ha habido un error");
    }
});

router.post('/agregar/:id', async (req,res) => {
        try {
            const params = req.params;
            const Carrito = controllerConfig(bdSeleccionada);
            const controller = new Carrito(bdProductos);
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
            const Carrito = controllerConfig(bdSeleccionada);
            const controller = new Carrito(bdProductos);
            await controller.borrar(params.id);
            res.send('Producto eliminado con éxito');
        }
        catch (err) {
            res.status(err).send("Ha habido un error");
        }
});

module.exports = {router};