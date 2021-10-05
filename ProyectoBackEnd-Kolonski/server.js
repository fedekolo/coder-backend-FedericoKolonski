// CONFIG INICIAL
const express = require('express');
const app = express();

// SERVIDOR / ENRUTADOR
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

// ENRUTADOR
app.use('/productos',require('./routes/productos'));
app.use('/carrito',require('./routes/carrito'));

// CONFIG ADMIN 
const isAdmin = true; //determina si el usuario que ingresa es admin o no
module.exports.isAdmin = isAdmin;
app.get('/admin',(req,res) => {
    try {
        res.json(isAdmin);
    } catch {
        console.log(err);
    }
})
