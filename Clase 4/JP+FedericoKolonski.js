// CONFIGURACION CONEXIONES
const conexion1 = new Promise ((resolve,reject) => {
    const porcentaje = Math.random();
    setTimeout(() => porcentaje>0.2 ? resolve("ok1") : reject("error1"),
    3000)
});
const conexion2 = new Promise ((resolve,reject) => {
    const porcentaje = Math.random();
    setTimeout(() => porcentaje>0.2 ? resolve("ok2") : reject("error2"),
    2000)
});
const conexion3 = new Promise ((resolve,reject) => {
    const porcentaje = Math.random();
    setTimeout(() => porcentaje>0.2 ? resolve("ok3") : reject("error3"),
    5000)
});
const conexion4 = new Promise ((resolve,reject) => {
    const porcentaje = Math.random();
    setTimeout(() => porcentaje>0.2 ? resolve("ok4") : reject("error4"),
    1000)
});
const conexion5 = new Promise ((resolve,reject) => {
    const porcentaje = Math.random();
    setTimeout(() => porcentaje>0.2 ? resolve("ok5") : reject("error5"),
    4000)
});

// INICIO CONEXIONES
console.log("Inicio de accesos a internet.");
const procesoConexion = () => {
    
    // FUNCION GENERADORA NUMEROS AL AZAR
    function *numeroAzar() {
        while(true) {
            yield Math.random()*100
        }
    }
    const ejecutarNumeroAzar = numeroAzar();

    // ITERACION CONEXIONES
    const conexiones = [conexion1,conexion2,conexion3,conexion4,conexion5];
    for (const conexion of conexiones) {
        conexion
            .then(resultado => console.log(ejecutarNumeroAzar.next().value,resultado))
            .catch(error => console.log(ejecutarNumeroAzar.next().value,error));
    }

    // EJECUCION DE 25 NUMEROS AL AZAR
    let ejecuciones = 0;
    while(ejecuciones<25) {
        ejecuciones++;
        console.log(ejecutarNumeroAzar.next().value)
    } 
}

procesoConexion();

