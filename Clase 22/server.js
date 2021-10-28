// INICIADORES
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const Producto = require('./models/productos');
const Mensaje = require('./models/mensajes');
const conexionDB = require('./db/conexionDB');

// SERVIDOR / ENRUTADOR
const PORT = 8080;
const routerApi = express.Router();
const router = express.Router();
http.listen(PORT,() => console.log(`Servidor escuchando en el puerto ${PORT}`));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api',routerApi);
app.use('/',router);
app.use(express.static('views'));

// CONFIG DE PROCESOS
class Archivo {
    constructor (archivo) {
        this.archivo = archivo;
    }

    listar() {
        return this.archivo;
    }

    async guardar(productoBody) {
        const productoParaAgregar = {
            title: productoBody.title,
            price: parseInt(productoBody.price),
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length+1
        };

        try {
            await Producto(productoParaAgregar).save();
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
        }
    }

    async actualizar(id,productoBody) {      
        const productoActualizado = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        };
        try {
            await Producto.updateOne({id: id}, {$set: productoActualizado});
            return productoActualizado;
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
        }
    }

    async borrar(id) {
        try {
            await Producto.deleteOne({id: id});
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
        }

        const productoEliminado = this.archivo.filter(producto => producto.id==id);
        this.archivo = this.archivo.filter(producto => producto.id!=id);
        return productoEliminado;
    }

    async guardarMensaje(data) {
        const mensajeParaAgregar = {
            mail: data.mail,
            mensaje: data.mensaje,
            fechaHora: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a')
        };

        try {
            await Mensaje(mensajeParaAgregar).save();
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
        }
    }
}

// CONFIG HANDLEBARS
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "main.hbs",
        layoutsDir: __dirname + "/views"
    })
);

app.set('views', './views'); 
app.set('view engine', 'hbs');

// SOCKET
io.on('connection', async (socket) => {
    // Refrescar productos
    socket.on('refrescar',(data) => {
        io.sockets.emit('productoNuevo',data);
    });

    // Chat de usuarios
        try {
            const mensajes = await Mensaje.find().lean();
            io.sockets.emit('mensajes', mensajes);
            socket.on('nuevo', async (data) => {
                const bdMensajes = await Producto.find().lean();
                const bd = new Archivo(bdMensajes);
                await bd.guardarMensaje(data);
                io.sockets.emit('mensajes',mensajes);
            });
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
        }
})

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
        res.render('add',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/vista-test', async (req,res) => {
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