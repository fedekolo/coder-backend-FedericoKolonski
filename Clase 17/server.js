// INICIADORES
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const fs = require('fs');
const {options} = require('./options/SQlite3');
const knex = require('knex')(options);
const {optionsMariaDB} = require('./options/mariaDB');
const knexMariaDB = require('knex')(optionsMariaDB);

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

    listarId(id) {
        (async () => {
            try {
                const productoFiltrado = await knexMariaDB('productos').select('*').where('id', '==', id);
                return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    guardar(productoBody) {
        const productoParaAgregar = [{
            title: productoBody.title,
            price: parseInt(productoBody.price),
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length+1
        }];

        (async () => {
            try {
                await knexMariaDB('productos').insert(productoParaAgregar);
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    actualizar(id,productoBody) {      
        const productoActualizado = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        };

        (async () => {
            try {
                await knexMariaDB('productos').select('*').where('id', '=', id).update(productoActualizado);
                return productoActualizado;
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    }

    borrar(id) {
        (async () => {
            try {
                await knexMariaDB('productos').where('id', '=', id).del();
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();

        const productoEliminado = this.archivo.filter(producto => producto.id==id);
        this.archivo = this.archivo.filter(producto => producto.id!=id);
        return productoEliminado;
    }

    async guardarMensaje(data) {
        const mensajeParaAgregar = [{
            mail: data.mail,
            mensaje: data.mensaje,
            fechaHora: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a')
        }];

        (async () => {
            try {
                await knex('mensajes').insert(mensajeParaAgregar);
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
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

// BASE DE DATOS MENSAJES CON SQLITE3
(async ()=>{
    try {
        // creo la tabla de mensajes en el caso de no existir
        await knex.schema.hasTable('mensajes').then((exists) => {
            if (!exists) {
              return knex.schema.createTable('mensajes', (table) => {
                table.string('mail'),
                table.string('mensaje'),
                table.string('fechaHora')
              });
            }
          });
    }

    catch(e) {
        console.log('Error en proceso:', e);
        knex.destroy();
    }
})();

// BASE DE DATOS PRODUCTOS CON MARIADB
(async ()=>{
    try {
        // creo la tabla de productos en el caso de no existir
        await knexMariaDB.schema.hasTable('productos').then((exists) => {
            if (!exists) {
              return knexMariaDB.schema.createTable('productos', (table) => {
                table.string('title'),
                table.integer('price'),
                table.string('thumbnail'),
                table.integer('id')
              });
            }
          });
    }

    catch(e) {
        console.log('Error en proceso:', e);
        knex.destroy();
    }
})();

// SOCKET
io.on('connection', async (socket) => {
    // Refrescar productos
    socket.on('refrescar',(data) => {
        io.sockets.emit('productoNuevo',data);
    });

    // Chat de usuarios
    (async () => {
        try {
            const mensajes = await knex.from('mensajes').select('*');
            io.sockets.emit('mensajes', mensajes);
            socket.on('nuevo', async (data) => {
                const bdMensajes = new Archivo(mensajes);
                await bdMensajes.guardarMensaje(data);
                io.sockets.emit('mensajes',mensajes);
            });
            // knex.destroy();
        }
    
        catch(e) {
            console.log('Error en proceso:', e);
            knex.destroy();
        }
    })();
})

// RUTAS
router.get('/',(req,res) => {
    res.redirect('/api/productos/agregar');
});

routerApi.get('/productos/vista', async (req,res) => {
    try {
        const bdProductos = await knexMariaDB.from('productos').select('*');
        const bd = new Archivo(bdProductos);
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('index',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
        knex.destroy();
    }
});

routerApi.get('/productos/agregar', async (req,res) => {
    try {
        const bdProductos = await knexMariaDB.from('productos').select('*');
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
        const productoBody = req.body;
        const bdProductos = await knexMariaDB.from('productos').select('*');
        const bd = new Archivo(bdProductos);
        const archivo = await bd.guardar(productoBody);
        res.redirect('/api/productos/agregar');
    }
    catch (err) {
        console.log(err);
    }
});

routerApi.put('/productos/actualizar/:id', async (req,res) => {
    try {
        const params = req.params;
        const productoBody = req.body;
        const bdProductos = await knexMariaDB.from('productos').select('*');
        const bd = new Archivo(bdProductos);
        const archivo = await bd.actualizar(params.id,productoBody);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

routerApi.delete('/productos/borrar/:id', async (req,res) => {
    try {
        const params = req.params;
        const bdProductos = await knexMariaDB.from('productos').select('*');
        const bd = new Archivo(bdProductos);
        const archivo = await bd.borrar(params.id);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});