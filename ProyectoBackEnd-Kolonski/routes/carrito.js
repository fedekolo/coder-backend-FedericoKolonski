// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const server = require('../server'); 

// CONEXION A BASE DE DATOS + CONTROLLER
const Carrito = require('../controller/carrito');
const controller = new Carrito('./bd/carrito.txt');

// RUTAS
router.get('/listar', async (req,res) => {
    try {
        const productos = await controller.listar();
        res.json(productos);
    } catch (err) {
        res.send('Ha habido un error:', err);
    }
});

router.get('/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const producto = await controller.listarId(params.id);
        res.json(producto);
    } catch (err) {
        res.send('Ha habido un error:', err);
    }
});

router.post('/agregar/:id', async (req,res) => {
        try {
            const params = req.params;
            await controller.agregar(params.id);
            res.send('Producto agregado al carrito con éxito');
        }
        catch (err) {
            res.send('Ha habido un error:', err);
        }
});

router.delete('/borrar/:id', async (req,res) => {
        try {
            const params = req.params;
            await controller.borrar(params.id);
            res.send('Producto eliminado con éxito');
        }
        catch (err) {
            res.send('Ha habido un error:', err);
        }
});

module.exports = router;