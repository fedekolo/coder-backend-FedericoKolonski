const fs = require('fs');

class Archivo {
    constructor (nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async leer() {
        try {
            const archivo = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            console.log(archivo);
        } catch (err) {
            console.log([]);
        }
    }

    async guardar(title,price,thumbnail) {
        try {
            const archivo = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            const archivoObj = JSON.parse(archivo);
            const productoParaAgregar = {
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: archivoObj.length+1
            }
            archivoObj.push(productoParaAgregar);
            const archivoJson = JSON.stringify(archivoObj, null, '\t');
            await fs.promises.writeFile(this.nombreArchivo,archivoJson);
            console.log("Archivo guardado");
        }
        catch (err) {
            console.log(err);
        }
    }

    async borrar() {
        try {
            await fs.promises.unlink(this.nombreArchivo);
            console.log("Archivo borrado");
        } catch (err) {
            console.log(err);
        }
    }

}

let archivo1 = new Archivo('productos.txt');
// archivo1.leer();
// archivo1.guardar("Coca Cola",200,"https://http2.mlstatic.com/D_NQ_NP_781546-MLA45254190473_032021-O.jpg");
// archivo1.borrar();



