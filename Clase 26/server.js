// INICIADORES
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const {normalize, schema} = require('normalizr');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true};

// SERVIDOR / ENRUTADOR
const PORT = 8080;
const router = require('./routes/routes');
http.listen(PORT,() => console.log(`Servidor escuchando en el puerto ${PORT}`));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api',router.routerApi);
app.use('/',router.router);
app.use(express.static('views'));
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://fedekolo:hLpilX2lYVbZmMag@cluster0.gsxpw.mongodb.net/cluster0?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
