const express = require('express');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

class Archivo {
    constructor (archivo) {
        this.archivo = archivo;
    }

    listar() {
        return this.archivo==[] ? {error: 'No hay productos cargados'} : this.archivo;
    }

    listarId(id) {
        const productoFiltrado = this.archivo.find(producto => producto.id==id);
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
        return productoParaAgregar;
    }
}

let archivo1 = new Archivo([
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

app.get('/api/productos/listar', async (req,res) => {
    try {
        const archivo = await archivo1.listar();
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/productos/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const archivo = await archivo1.listarId(params.id);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

app.post('/api/productos/guardar', async (req,res) => {
    try {
        const productoBody = req.body;
        const archivo = await archivo1.guardar(productoBody);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});

const server = app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});