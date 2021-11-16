// INICIADORES
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');
const app = express();
const user = express.Router();
const mongoose = require('mongoose');

// CONFIG PASSPORT
passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'usuario',
    passwordField: 'contrasena'
},
    function (req, usuario, contrasena, done) {

        // OPCION CON CLASE
        // const controllerPassport = new Controller();
        // const usuarioFiltrado = controllerPassport.obtenerUsuario(usuario);

        // OPCION CON FUNCION
        // const usuarioFiltrado = async () => await obtenerUsuario(usuario);

        // OPCION ACÁ
        let usuarioFiltrado = async () => {
            try {
                const usuarioFiltrado = await Usuario.find({usuario: usuario});
                const opcionRetorno = usuarioFiltrado === [] ? true : false;
                mongoose.disconnect();
                return opcionRetorno;
            } catch (e) {
                console.log(e);
            }
        } 

        if (usuarioFiltrado() === []) {
            return done(null, false, console.log('Usuario ya existe'));
        } else {
            const nuevoUsuario = {
                usuario,
                correo: req.body.correo,
                contrasena
            }
            try {
                const agregarUsuario = async () => await Usuario(nuevoUsuario).save();
                agregarUsuario();
            }
            catch(e) {
                console.log('Error en proceso:', e);
            }
            return done(null, nuevoUsuario);
        }
    }
));

passport.use('login', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'usuario',
        passwordField: 'contrasena'
    }, 
    function (req, usuario, contrasena, done) {
                
        // OPCION CON FUNCION
        const usuarioFiltrado = async () => await obtenerUsuario(usuario);

        if (usuarioFiltrado == undefined) {
            return done(null, false, console.log(username, 'usuario no existe'));
        } else {
            if (comprobarContrasena(usuario, contrasena)) {
                return done(null, usuario)  
            } else {
                return done(null, false, console.log(username, 'password errónea'));
            }
        }
    })
);

passport.serializeUser((usuario, done)=>{
    done(null, usuario);
});

passport.deserializeUser((usuario, done)=>{
    done(null, usuario);
});

// ROUTES PASSPORT

app.post('/login', passport.authenticate('login', 
    {failureFlash: 'Hubo un error en los datos ingresados.'}),
    (req,res) => {
        res.redirect('/api/productos/agregar');
});

user.get('/login',(req,res) => {
    res.render('login');
});

user.post('/signup', passport.authenticate('signup',
{ failureFlash: 'Hubo un error en los datos ingresados. Puede que el usuario ya exista.' }), 
(req,res) => {
    res.redirect('/api/productos/agregar');
});

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/api/productos/agregar');
});

// CONTROLLER PASSPORT
class Controller {
    constructor (bd) {
        this.bd = bd;
    }

    async obtenerUsuario(usuario) {
        try {
            let usuarioFiltrado = await Usuario.find({usuario: usuario});
            return usuarioFiltrado === [] ? false : true;
        } catch (e) {
            console.log(e)
        }
        console.log(usuarioFiltrado)
    }
}

const obtenerUsuario = async (usuario) => {
    try {
        let usuarioFiltrado = await Usuario.find({usuario: usuario});
        return usuarioFiltrado;
    } catch (e) {
        console.log(e)
    }
}

const comprobarContrasena = async (contrasena,usuario) => {
    try {
        let usuarioFiltrado = await Usuario.find({usuario: usuario});
        let resultado = usuarioFiltrado[0].contrasena == contrasena ? true : false;
        return resultado;
    } catch (e) {
        console.log(e)
    }
}

module.exports = {user};