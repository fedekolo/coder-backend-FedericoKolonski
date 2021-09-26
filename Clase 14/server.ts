// INICIADORES
import express from 'express';
import handlebars from 'express-handlebars';
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
import moment from 'moment';
import fs from 'fs';

// SERVIDOR / ENRUTADOR
const PORT: number = 8080;
const routerApi: any = express.Router();
const router: any = express.Router();
http.listen(PORT,() => console.log(`Servidor escuchando en el puerto ${PORT}`));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api',routerApi);
app.use('/',router);
app.use(express.static('views'));

// CONFIG DE PROCESOS
class Archivo {
    constructor (archivo: any) {
        this.archivo = archivo;
    }

    listar() {
        return this.archivo;
    }

    listarId(id:number) {
        const productoFiltrado: any = archivo.find(producto => producto.id==id);
        return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
    }

    guardar(productoBody: object) {
        const productoParaAgregar = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length+1
        }
        this.archivo.push(productoParaAgregar);
    }

    actualizar(id:number,productoBody:object) {      
        this.archivo[id-1] = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        }
        return this.archivo[id-1];
    }

    borrar(id) {
        const productoEliminado = this.archivo.filter(producto => producto.id==id);
        this.archivo = this.archivo.filter(producto => producto.id!=id);
        return productoEliminado;
    }

    async guardarMensaje(data:object) {
        const archivo = await fs.promises.readFile('./chat.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        const mensajeParaAgregar = {
            mail: data.mail,
            mensaje: data.mensaje,
            fechaHora: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a')
        }
        archivoObj.push(mensajeParaAgregar);
        const archivoActualizado = JSON.stringify(archivoObj, null, '\t');
        await fs.promises.writeFile('./chat.txt',archivoActualizado);
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

// BASE DE DATOS
let bd = new Archivo([
    {
		"title": "Escuadra",
		"price": 123.45,
		"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
		"id": 1
	},
	{
		"title": "Calculadora",
		"price": 234.56,
		"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
		"id": 2
	},
	{
		"title": "Globo Terráqueo",
		"price": 345.67,
		"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
		"id": 3
	}
]);

// SOCKET
io.on('connection', async (socket:any) => {
    // Refrescar productos
    socket.on('refrescar',(data:object) => {
        io.sockets.emit('productoNuevo',data);
    });

    // Chat de usuarios
    const mensajes = await fs.promises.readFile('./chat.txt','utf-8');
    const mensajesObj = JSON.parse(mensajes);
    io.sockets.emit('mensajes', mensajesObj);
    socket.on('nuevo', async (data:object) => {
        const bdMensajes = new Archivo(mensajesObj);
        await bdMensajes.guardarMensaje(data);
        io.sockets.emit('mensajes',mensajesObj);
    });
})

// RUTAS
router.get('/',(req:any,res:any) => {
    res.redirect('/api/productos/agregar');
});

routerApi.get('/productos/vista', async (req:any,res:any) => {
    try {
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('index',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/agregar', async (req:any,res:any) => {
    try {
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('add',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.post('/productos/guardar', async (req:any,res:any) => {
    try {
        const productoBody = req.body;
        const archivo = await bd.guardar(productoBody);
        res.redirect('/api/productos/agregar');
    }
    catch (err) {
        console.log(err);
    }
});

routerApi.put('/productos/actualizar/:id', async (req:any,res:any) => {
    try {
        const params = req.params;
        const productoBody = req.body;
        const archivo = await bd.actualizar(params.id,productoBody);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

routerApi.delete('/productos/borrar/:id', async (req:any,res:any) => {
    try {
        const params = req.params;
        const archivo = await bd.borrar(params.id);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});