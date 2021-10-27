// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const server = require('../server'); 

// CONEXION CON BD FACTORY
const bdSeleccionada = 4; 

const bdConfig = async (bdSeleccionada) => {
    
    if (bdSeleccionada === 0) {
        // FILE SYSTEM

        const bdProductos = '../controller/fs/productos';
        return bdProductos;

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
                        table.string('nombre'),
                        table.string('descripcion'),
                        table.integer('codigo'),
                        table.integer('precio'),
                        table.string('foto'),
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
        const bdProductos = await knexMariaDB.from('productos').select('*');
        return bdProductos;
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
                            table.string('nombre'),
                            table.string('descripcion'),
                            table.integer('codigo'),
                            table.integer('precio'),
                            table.string('foto'),
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
        const bdProductos = await knexSQlite3.from('productos').select('*');
        return bdProductos;
    } else if (bdSeleccionada === 3) {
        // MONGODB

        const conexionMongoDB = require('../bd/mongoDB/conexionDB');
        conexionMongoDB();
        const Producto = require('../bd/mongoDB/models/productos');
        const bdProductos = await Producto.find().lean();
        return bdProductos;
    } else if (bdSeleccionada === 4) {
        // FIREBASE

        const admin = require("firebase-admin");
        const conexionFirebase = require('../bd/firebase/firebase');
        conexionFirebase();
        const firestore = admin.firestore();
        const collection = await firestore.collection('productos');
        const querySnapshot = await collection.get();
        const docs = querySnapshot.docs;

        const bdProductos = docs.map((doc) => ({
            id: doc.id,
            timestamp: doc.data().timestamp,
            nombre: doc.data().nombre,
            descripcion: doc.data().descripcion,
            codigo: doc.data().codigo,
            foto: doc.data().foto,
            precio: doc.data().precio,
            stock: doc.data().stock
        }));

        return bdProductos;
    }

};

const bdProductos = bdConfig(bdSeleccionada);

const controllerConfig = (bdSeleccionada) => {
    if (bdSeleccionada === 0) {
        const Productos = require('../controller/fs/productos');
        return Productos;
    } else if (bdSeleccionada === 1) {
        const Productos = require('../controller/mariaDB/productos');
        return Productos;
    } else if (bdSeleccionada === 2) {
        const Productos = require('../controller/SQlite3/productos');
        return Productos;
    } else if (bdSeleccionada === 3) {
        const Productos = require('../controller/mongoDB/productos');
        return Productos;
    } else if (bdSeleccionada === 4) {
        const Productos = require('../controller/firebase/productos');
        return Productos;
    }
};


// RUTAS
router.get('/listar', async (req,res) => {
    try {     
        const Productos = controllerConfig(bdSeleccionada);
        const controller = new Productos(bdProductos);
        const productos = await controller.listar();
        res.json(productos);
    } catch (err) {
        res.status(err).send("Ha habido un error");
    }
});

router.get('/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const Productos = controllerConfig(bdSeleccionada);
        const controller = new Productos(bdProductos);
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
            const Productos = controllerConfig(bdSeleccionada);
            const controller = new Productos(bdProductos);
            await controller.agregar(productoBody);
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
            const Productos = controllerConfig(bdSeleccionada);
            const controller = new Productos(bdProductos);
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
            const Productos = controllerConfig(bdSeleccionada);
            const controller = new Productos(bdProductos);
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