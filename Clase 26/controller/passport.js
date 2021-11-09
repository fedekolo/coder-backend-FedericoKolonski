// INICIADORES
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');

// CONFIG PASSPORT
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    function (req, usuario, contrasena, done) {
        const usuarioFiltrado = obtenerUsuario(usuario);
        if (usuarioFiltrado != undefined) {
            return done(null, false, console.log('Usuario ya existe'));
        } else {
            const nuevoUsuario = {
                usuario,
                mail,
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

// CONTROLLER PASSPORT
const obtenerUsuario = async (usuario) => {
    const usuarioFiltrado = await Usuario.find({usuario: usuario});
    if (usuarioFiltrado == {}) {
        return undefined;
    } else {
        return;
    }
}

module.exports = passport;