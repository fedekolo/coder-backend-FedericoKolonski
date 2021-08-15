const recorrerTexto = (texto,tiempo,cb) => {
    let palabras = texto.split(' ');
    let duracion = tiempo ?? 1000
    for (let i = 0; i < palabras.length; i++) {  
        setInterval(
            () => {
                console.log(palabras[i]);
            }, duracion
        )
        cb(palabras);
    }
}

const final = (palabras) => console.log('Proceso terminado',palabras.length)

recorrerTexto('hola que tal',2000,final);