// INICIADORES
const express = require('express');
const handlebars = require('express-handlebars');

// SERVIDOR / ENRUTADOR
const app = express();
const PORT = 8080;
const routerApi = express.Router();
const router = express.Router();
const server = app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

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
        const productoFiltrado = archivo.find(producto => producto.id==id);
        return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
    }

    guardar(productoBody) {
        const productoParaAgregar = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length+1
        }
        this.archivo.push(productoParaAgregar);
    }

    actualizar(id,productoBody) {      
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

// RUTAS
routerApi.get('/productos/vista', async (req,res) => {
    try {
        const archivo = await bd.listar();
        const sinProductos = archivo.length==0 ? true : false;
        res.render('index',{producto: archivo,sinProductos: sinProductos});
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/agregar',(req,res) => {
    res.render('add');
});

routerApi.post('/productos/guardar', async (req,res) => {
    try {
        const productoBody = req.body;
        const archivo = await bd.guardar(productoBody);
        res.render('add');
    }
    catch (err) {
        console.log(err);
    }
});

routerApi.put('/productos/actualizar/:id', async (req,res) => {
    try {
        const params = req.params;
        const productoBody = req.body;
        const archivo = await bd.actualizar(params.id,productoBody);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

app.delete('/api/productos/borrar/:id', async (req,res) => {
    try {
        const params = req.params;
        const archivo = await bd.borrar(params.id);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});