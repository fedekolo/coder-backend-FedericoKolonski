import Calculo from "./calculo.js";

const operacion = async (num1, num2, tipo) => {

    return await new Promise ((resolve,reject)=>{
        tipo=="suma" || tipo=="resta" ? 
        resolve(new Calculo(num1,num2,tipo).getResultado()) : 
        reject("Error en el tipo")
    })
}

const operaciones = async (num1, num2, tipo, cb) => {
    
    return await cb(num1, num2, tipo)
    .then((resultado) => console.log(resultado))
    .catch((error) => console.log(error))

}

operaciones(10,20,"suma",operacion);
operaciones(30,20,"resta",operacion);
operaciones(20,20,"division",operacion);