const fs = require('fs');
const moment = require('moment');

class Productos {
    constructor (bd) {
        this.bd = bd;
    }

    async listar() {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        return productosObj;
    }

    async listarId(id) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        const productoFiltrado = productosObj.find(producto => producto.id==id);
        return productoFiltrado==undefined ? {error: 'Producto no encontrado'} : productoFiltrado;
    }

    async agregar(productoBody) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        const productoParaAgregar = {
            id: productosObj.length+1,
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            nombre: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            foto: productoBody.foto,
            precio: productoBody.precio,
            stock: productoBody.stock
        }
        productosObj.push(productoParaAgregar);
        const productosActualizado = JSON.stringify(productosObj, null, '\t');
        await fs.promises.writeFile(this.bd,productosActualizado);
        return;
    }

    async actualizar(id,productoBody) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        const indiceProducto = productosObj.findIndex(producto => producto.id === parseInt(id));        
        productosObj[indiceProducto] = {
            id: parseInt(id),
            timestamp: moment().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a'),
            nombre: productoBody.nombre,
            descripcion: productoBody.descripcion,
            codigo: productoBody.codigo,
            foto: productoBody.foto,
            precio: productoBody.precio,
            stock: productoBody.stock
        }
        const productoActualizado = JSON.stringify(productosObj, null, '\t');
        await fs.promises.writeFile(this.bd,productoActualizado);
        return;
    }

    async borrar(id) {
        const productos = await fs.promises.readFile(this.bd,'utf-8');
        const productosObj = JSON.parse(productos);
        const productosFiltrados = productosObj.filter(producto => producto.id!=id);
        const archivoActualizado = JSON.stringify(productosFiltrados, null, '\t');
        await fs.promises.writeFile(this.bd,archivoActualizado);
        return;
    }

}

module.exports = Productos;