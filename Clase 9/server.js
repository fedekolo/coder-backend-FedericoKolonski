const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;
const routerApi = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api',routerApi);
app.use(express.static('public'));

class Archivo {
    constructor (archivo) {
        this.archivo = archivo;
    }

    async listar() {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        return archivoObj==[] ? {error: 'No hay productos cargados'} : archivoObj;
    }

    async listarId(id) {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        const productoFiltrado = archivoObj.find(producto => producto.id==id);
        return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
    }

    async guardar(productoBody) {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        const productoParaAgregar = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: archivoObj.length+1
        }
        archivoObj.push(productoParaAgregar);
        const archivoActualizado = JSON.stringify(archivoObj, null, '\t');
        await fs.promises.writeFile('./productos.txt',archivoActualizado);
        return productoParaAgregar;
    }

    async actualizar(id,productoBody) {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);        
        archivoObj[id-1] = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        }
        const archivoActualizado = JSON.stringify(archivoObj, null, '\t');
        await fs.promises.writeFile('./productos.txt',archivoActualizado);
        return archivoObj[id-1];
    }

    async borrar(id) {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        const productosFiltrados = archivoObj.filter(producto => producto.id!=id);
        const productoEliminado = archivoObj.filter(producto => producto.id==id);
        const archivoActualizado = JSON.stringify(productosFiltrados, null, '\t');
        await fs.promises.writeFile('./productos.txt',archivoActualizado);
        return productoEliminado;
    }
}

let archivo1 = new Archivo('productos.txt');

routerApi.get('/productos/listar', async (req,res) => {
    try {
        const archivo = await archivo1.listar();
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

routerApi.get('/productos/listar/:id', async (req,res) => {
    try {
        const params = req.params;
        const archivo = await archivo1.listarId(params.id);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

routerApi.post('/productos/guardar', async (req,res) => {
    try {
        const productoBody = req.body;
        const archivo = await archivo1.guardar(productoBody);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});

routerApi.put('/productos/actualizar/:id', async (req,res) => {
    try {
        const params = req.params;
        const productoBody = req.body;
        const archivo = await archivo1.actualizar(params.id,productoBody);
        res.json(archivo);
    } catch (err) {
        console.log(err);
    }
});

app.delete('/api/productos/borrar/:id', async (req,res) => {
    try {
        const params = req.params;
        const archivo = await archivo1.borrar(params.id);
        res.json(archivo);
    }
    catch (err) {
        console.log(err);
    }
});

const server = app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});