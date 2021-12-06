// INICIADORES
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const flash = require('express-flash');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const {normalize, schema} = require('normalizr');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true};
const router = require('./routes/routes');
const {user} = require('./controller/passport');
const {fork} = require('child_process');
const cluster = require('cluster');
const compression = require('compression');
const log4js = require('log4js');
const loggerConsola = log4js.getLogger('info');
const loggerWarning = log4js.getLogger('warning');
const loggerError = log4js.getLogger('error');

// MIDDLEWARES
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://fedekolo:hLpilX2lYVbZmMag@cluster0.gsxpw.mongodb.net/cluster0?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api',router.routerApi);
app.use('/',router.router);
app.use('/user',user);
// app.use(express.static('views'));

//Para convertir en HTTPS
const https = require('https');
const fs = require('fs'); 
const httpsOptions = {
    key: fs.readFileSync('./sslcert/cert.key'),
    cert: fs.readFileSync('./sslcert/cert.pem')
};

// SERVIDOR / ENRUTADOR / CLUSTER
const PORT = parseInt(process.argv[2] || 8081);

if (cluster.isMaster){
    loggerConsola.info(`Master PID ${process.pid} está corriendo`);
    cluster.fork();
    cluster.on('exit', (worker, code, signal) => { 
        loggerWarning.warning(`Worker ${worker.process.pid} finalizó`);
        cluster.fork();
    });
} else {
    const server = https.createServer(httpsOptions, app)
    .listen(PORT, () => {
        loggerConsola.info('Server corriendo en ' + PORT);
    });
    server.on('error', error=>loggerError.error(error));
};

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

// CONFIG LOG4JS
log4js.configure({
    appenders: {
        consola: { type: "console" },
        fileWarn: { type: 'file', filename: 'warn.log' },
        fileError: { type: 'file', filename: 'error.log' }
    },
    categories: {
        default: { appenders: ["consola"], level: "trace" },
        info: { appenders: ["consola"], level: "info" },
        warning: { appenders: ["fileWarn"], level: "warn" },
        error: { appenders: ["fileError"], level: "error" }
    }
});

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
//             loggerError.error(e);
//         }
// });
