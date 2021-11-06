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
const {normalize, schema} = require('normalizr');
const session = require('express-session');

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
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
}));

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
            author: {
                id: data.mail,
                nombre: data.nombre,
                apellido: data.apellido,
                edad: data.edad,
                alias: data.alias,
                avatar: data.avatar
            },
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
// io.on('connection', async (socket) => {
//     // Refrescar productos
//     socket.on('refrescar',(data) => {
//         io.sockets.emit('productoNuevo',data);
//     });

//     // Chat de usuarios
//         try {
//             const mensajes = {id: "1", mensajes: await Mensaje.find().lean()};
//             const mensajeSchema = new schema.Entity('mensaje');
//             const fechaHoraSchema = new schema.Entity('fechaHora');
//             const authorSchema = new schema.Entity('author',{},{idAttribute: 'mail'});
//             const mensajesSchema = new schema.Entity('mensajesBase',{
//                 mensaje: mensajeSchema,
//                 fechaHora: fechaHoraSchema,
//                 author: [authorSchema]
//             });
//             const mensajesBase = new schema.Entity('mensajes',{
//                 mensajes: [mensajesSchema]
//             });
//             const normalizarMensajes = normalize(mensajes,mensajesBase);
//             io.sockets.emit('mensajes', normalizarMensajes);

//             socket.on('nuevo', async (data) => {
//                 const bdMensajes = await Producto.find().lean();
//                 const bd = new Archivo(bdMensajes);
//                 await bd.guardarMensaje(data);
//                 const mensajeSchema = new schema.Entity('mensaje');
//                 const fechaHoraSchema = new schema.Entity('fechaHora');
//                 const authorSchema = new schema.Entity('author',{},{idAttribute: 'mail'});
//                 const mensajesSchema = new schema.Entity('mensajesBase',{
//                     mensaje: mensajeSchema,
//                     fechaHora: fechaHoraSchema,
//                     author: [authorSchema]
//                 });
//                 const mensajesBase = new schema.Entity('mensajes',{
//                     mensajes: [mensajesSchema]
//                 });
//                 const normalizarMensajes = normalize(mensajes,mensajesBase);
//                 io.sockets.emit('mensajes',normalizarMensajes);
//             });
//         }
    
//         catch(e) {
//             console.log('Error en proceso:', e);
//         }
// });

// CONFIG USERS
const auth = (req, res, next) => {
    if (req.session?.admin) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

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

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.send('logout success!');
});