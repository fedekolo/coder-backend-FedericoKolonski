const mongoose = require('mongoose');
const log4js = require('log4js');
const loggerConsola = log4js.getLogger('info');

const conexionDB = async () => {
    loggerConsola.info("Conectando a la base de datos");

    const URI = 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(URI, 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 1000
        });
    
}

module.exports = conexionDB;
