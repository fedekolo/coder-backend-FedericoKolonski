// CONFIG INICIAL
const express = require('express');
const router = express.Router();
const routerApi = express.Router();
const app = express();
const conexionDB = require('../db/conexionDB');
const Producto = require('../models/productos');
const Archivo = require('../controller/productos');
// const passport = require('passport');

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

// app.post('/login', (req,res)=>{
//     if (req.body.usuario == "fede" && req.body.contrasena == "123"){
//         req.session.user = "fede";
//         req.session.admin = true;
//         req.session.cookie.maxAge = 60000;
//         res.redirect('/api/productos/agregar');
//     } else {
//         res.send('Usuario o contraseña erroneos.');
//     }
// });

// router.get('/login',(req,res) => {
//     res.render('login');
// });

// router.post('/signup', passport.authenticate('signup', 
// { failureFlash: 'Hubo un error en los datos ingresados. Puede que el usuario ya exista.' }), 
// (req,res) => {
//     res.redirect('/api/productos/agregar');
// });

// router.get('/signup',(req,res) => {
//     res.render('signup');
// });

// app.get('/logout', (req,res)=>{
//     req.session.destroy();
//     res.redirect('/api/productos/agregar');
// });

module.exports = { router, routerApi, app };