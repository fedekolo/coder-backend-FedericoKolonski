// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const routerApi = express.Router();
const app = express();
const conexionDB = require('../db/conexionDB');
const Producto = require('../models/productos');
const Archivo = require('../controller/productos');
const {usuarios} = require('../controller/passport');
// const passport = require('passport');
const {fork} = require('child_process');
const numCPUs = require('os').cpus().length;

// CONFIG USERS
const auth = (req, res, next) => {
    if (req.session?.admin) {
        return next();
    } else {
        return res.sendStatus(401);
    }
};

// RUTAS
router.get('/',(req,res) => {
    res.redirect('/api/productos/agregar');
});

routerApi.get('/productos/agregar', async (req,res) => {
    try {
        conexionDB();
        const bdProductos = await Producto.find().lean();
        const bd = new Archivo(bdProductos);
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('add',{producto: archivo,sinProductos: sinProductos, admin: req.session?.admin, user: req.session?.user});
        
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/vista-test', auth, async (req,res) => {
    try {
        const faker = require('./faker/generador');
        const bdProductos = []
        for (let index = 0; index < 10; index++) {
            bdProductos.push(faker.generadorInfo());
        }
        const bd = new Archivo(bdProductos);
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('add',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/vista-test/:cant', async (req,res) => {
    try {
        let cant = req.params;
        const faker = require('./faker/generador');
        const bdProductos = []
        for (let index = 0; index < cant.cant; index++) {
            bdProductos.push(faker.generadorInfo());
        }
        const bd = new Archivo(bdProductos);
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('add',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.post('/productos/guardar', async (req,res) => {
    try {
        conexionDB();
        const productoBody = req.body;
        const bdProductos = await Producto.find().lean();
        const bd = new Archivo(bdProductos);
        await bd.guardar(productoBody);
        res.redirect('/api/productos/agregar');
    }
    catch (err) {
        console.log(err);
    }
});

routerApi.put('/productos/actualizar/:id', async (req,res) => {
    try {
        conexionDB();
        const params = req.params;
        const productoBody = req.body;
        const bdProductos = await Producto.find().lean();
        const bd = new Archivo(bdProductos);
        const archivo = await bd.actualizar(params.id,productoBody);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

routerApi.delete('/productos/borrar/:id', async (req,res) => {
    try {
        conexionDB();
        const params = req.params;
        const bdProductos = await Producto.find().lean();
        const bd = new Archivo(bdProductos);
        const archivo = await bd.borrar(params.id);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/info', (req,res) => {
    const info = {
        argumentos: process.argv,
        sistemaOperativo: process.platform,
        versionNode: process.version,
        usoMemoria: process.memoryUsage().heapUsed,
        pathEjecucion: process.execPath,
        processId: process.pid,
        carpeta: process.cwd(),
        procesadores: `La cantidad de procesadores es ${numCPUs}`
    };
    res.json(info);
});

router.get('/randoms', (req,res) => {
    let {cant} = req.query;
    if (cant == undefined) {
        cant = '100000000';
    }
    const numerosRandom = fork('./controller/numerosRandom.js');
    numerosRandom.send(cant);
    numerosRandom.on('message',numero=>res.end(`${numero}`));
    console.log('Es no bloqueante');
});

module.exports = { router, routerApi, app };