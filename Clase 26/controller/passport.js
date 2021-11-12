// INICIADORES
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');
const app = express();
const user = express.Router();

// CONFIG PASSPORT
passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'usuario',
    passwordField: 'contrasena'
},
    function (req, usuario, contrasena, done) {
        const usuarioFiltrado = obtenerUsuario(usuario);
        if (usuarioFiltrado != undefined) {
            return done(null, false, console.log('Usuario ya existe'));
        } else {
            const nuevoUsuario = {
                usuario,
                correo,
                contrasena
            }
            try {
                async () => await Usuario(nuevoUsuario).save()
            }
            catch(e) {
                console.log('Error en proceso:', e);
            }
            return done(null, nuevoUsuario);
        }
    }
));

passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, 
    function (req, username, password, done) {
        let usuario = obtenerUsuario(usuarios, username);
        if (usuario == undefined) {
            return done(null, false, console.log(username, 'usuario no existe'));
        } else {
            if (passwordValida(usuario, password)) {
                return done(null, usuario)  
            } else {
                return done(null, false, console.log(username, 'password errónea'));
            }
        }
    })
);

passport.serializeUser((user, done)=>{
    done(null, user._id);
});

passport.deserializeUser((id, done)=>{
    let usuario = obtenerUsuarioId(usuarios, id);
    done(null, usuario);
});

// ROUTES PASSPORT

app.post('/login', (req,res)=>{
    if (req.body.usuario == "fede" && req.body.contrasena == "123"){
        req.session.user = "fede";
        req.session.admin = true;
        req.session.cookie.maxAge = 60000;
        res.redirect('/api/productos/agregar');
    } else {
        res.send('Usuario o contraseña erroneos.');
    }
});

user.get('/login',(req,res) => {
    res.render('login');
});

user.post('/signup', passport.authenticate('signup', 
{ failureFlash: 'Hubo un error en los datos ingresados. Puede que el usuario ya exista.' }), 
(req,res) => {
    res.redirect('/api/productos/agregar');
});

user.get('/signup',(req,res) => {
    res.render('signup');
});

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/api/productos/agregar');
});

// CONTROLLER PASSPORT
const obtenerUsuario = (usuario) => {
    const usuarioFiltrado = (async () => {

        try {
            return await Usuario.find({usuario: usuario});
        }
        catch(e) {
            console.log('Error en proceso:', e);
        }

    })();

    if (usuarioFiltrado === {}) {
        return undefined;
    } else {
        return;
    }
}

module.exports = {user};