// INICIADORES
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Usuario = require('../models/usuarios');
const app = express();
const user = express.Router();

const usuarios = [];

// CONFIG PASSPORT
passport.use(new FacebookStrategy({
    clientID: '1220766778410838',
    clientSecret: '0846fc42c8599bc290b37c37678d885f',
    callbackURL: `https://localhost:8443/`,
    profileFields: ['id', 'photos', 'email', 'name']
  },
  function(accessToken, refreshToken, profile, cb) {
      let indice = usuarios.findIndex(e=>e.id == profile.id);
      if (indice == -1) {
          let usuario = {
              id: profile.id,
              photos: profile.photos,
              email: profile.email,
              name: profile.name
          };
          usuarios.push(usuario);
          return cb(null, usuario);
      } else {
          return cb(null, usuarios[indice])
      }
  }
));

passport.serializeUser((id, done)=>{
    let usuario = usuarios[usuarios.findIndex(e=>e.id == id)];
    done(null, usuario);
});

passport.deserializeUser((id, done)=>{
    let usuario = usuarios[usuarios.findIndex(e=>e.id == id)];
    done(null, usuario);
}); 

// ROUTES PASSPORT

user.get('/facebook', passport.authenticate('facebook'));

user.get('/login',(req,res) => {
    res.render('login',{login: req.isAuthenticated()});
});

user.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/api/productos/agregar');
});

module.exports = {user,usuarios};