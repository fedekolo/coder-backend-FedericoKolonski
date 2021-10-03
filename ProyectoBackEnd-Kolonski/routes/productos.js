// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const server = require('../server'); 

// CONEXION A BASE DE DATOS + CONTROLLER
const Productos = require('../controller/productos');
const controller = new Productos('./bd/productos.txt');

// RUTAS
router.get('/listar', async (req,res) => {
    try {
        const productos = await controller.listar();
        res.json(productos);
    } catch (err) {
        console.log(err);
    }
});

router.get('/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const producto = await controller.listarId(params.id);
        res.json(producto);
    } catch (err) {
        console.log(err);
    }
});

router.post('/agregar', async (req,res) => {
    if (server.isAdmin) {
        try {
            const productoBody = req.body;
            await controller.agregar(productoBody);
            res.send('Producto agregado con éxito');
        }
        catch (err) {
            console.log(err);
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
            console.log(err);
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
            console.log(err);
        }
    } else {
        res.send('No puede ingresar a esta página');
    }
});

module.exports = router;