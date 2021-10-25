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
const routerProductos = require('./routes/productos');
app.use('/productos',routerProductos.router);
const routerCarrito = require('./routes/carrito');
app.use('/carrito',routerCarrito.router);

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
