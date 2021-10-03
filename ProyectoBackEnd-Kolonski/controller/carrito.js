// CONFIG INICIAL
const fs = require('fs');
const moment = require('moment');

// FUNCIONES
class Carrito {
    constructor (bd) {
        this.bd = bd;
    }

    async listar() {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        let productosObj = JSON.parse(productos);
        productosObj = productosObj[0].producto;
        return productosObj;
    }

    async listarId(id) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        let productosObj = JSON.parse(productos);
        productosObj = productosObj[0].producto;
        const productoFiltrado = productosObj.find(producto => producto.id==id);
        return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
    }

    async agregar(id) {
        const productos = await fs.promises.readFile('./bd/productos.txt','utf-8');
        const productosObj = JSON.parse(productos);
        const carrito = await fs.promises.readFile(this.bd,'utf-8');
        const carritoObj = JSON.parse(carrito);
        const productoParaAgregar = productosObj.find(producto => producto.id==id);
        productoParaAgregar.timestamp = moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a');
        carritoObj[0].producto.push(productoParaAgregar);
        const carritoActualizado = JSON.stringify(carritoObj, null, '\t');
        await fs.promises.writeFile(this.bd,carritoActualizado);
        return;
    }

    async borrar(id) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        const productosFiltrados = productosObj[0].producto.filter(producto => producto.id!=id);
        productosObj[0].producto = productosFiltrados;
        const archivoActualizado = JSON.stringify(productosObj, null, '\t');
        await fs.promises.writeFile(this.bd,archivoActualizado);
        return;
    }

}

module.exports = Carrito;