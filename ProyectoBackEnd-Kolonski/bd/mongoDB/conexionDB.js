const mongoose = require('mongoose');

const conexionDB = async () => {
    console.log("Conectando a base de datos MongoDB...");

    const URI = 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(URI, 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 1000
        });
    
}

module.exports = conexionDB;
