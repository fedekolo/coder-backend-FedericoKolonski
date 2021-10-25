const bdConfig = (bdSeleccionada) => {
    
    if (bdSeleccionada === 0) {
        const Carrito = require('../controller/fs/carrito');
        const bdFs = new Carrito('./bd/fs/carrito.txt');
        return bdFs;
    }

};

module.exports = bdConfig;