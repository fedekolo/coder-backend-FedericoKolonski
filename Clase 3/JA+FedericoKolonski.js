const recorrerTexto = (texto,tiempo,cb) => {
    let palabras = texto.split(' ');
    let duracion = tiempo ?? 1000;
    let i = 0;
    let intervalo = setInterval(
        () => {console.log(palabras[i++])
        if (palabras.length == i) {
            clearInterval(intervalo)
            cb(palabras);
        }
    }, duracion
    )
}

const final = (palabras) => console.log('Proceso terminado',palabras.length)

recorrerTexto('hola que tal',2000,final);