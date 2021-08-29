const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

let visitas1 = 0;
let visitas2 = 0;

app.get('/', async(req,res)=>{
    try {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        res.json({items: archivoObj,cantidad: archivoObj.length});
        visitas1++;
    } catch (err) {
        console.log(err);
    }
});

app.get('/item-random',async(req,res)=>{
    try {
        const archivo = await fs.promises.readFile('./productos.txt','utf-8');
        const archivoObj = JSON.parse(archivo);
        const numeroRandom = Math.floor(Math.random()*3);
        res.json({item: archivoObj[numeroRandom]});
        visitas2++;
    } catch (err) {
        console.log(err);
    }
});

app.get('/visitas',(req,res)=>{
    res.json({visitas:{
        items: visitas1,
        item: visitas2
    }});
});

const server = app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});