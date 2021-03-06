const admin = require("firebase-admin");
const serviceAccount = require("./ecommerce-backend-e1c99-firebase-adminsdk-esvs9-6f4115de70.json");

const conexionFirebase = () => {

    if (!admin.apps.length) {
      const firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://ecommerce-backend-e1c99-firebaseio.com"
      });
  }
    
    console.log('Conectando a la base de datos FireBase...');
};

module.exports = conexionFirebase;