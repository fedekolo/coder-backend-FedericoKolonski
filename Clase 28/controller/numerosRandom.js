const numerosRandom = (cant) => {
    const numerosRandom = [];
    let numeros = parseInt(cant);
    for (let index = 0; index < numeros; index++) {
        const numeroRandom = {
            numero: Math.floor((Math.random() * (1000 - 1 + 1)) + 1),
            cantidad: 1
        }

        if (numerosRandom.find(e => e.numero === numeroRandom.numero) == undefined) {
            numerosRandom.push(numeroRandom);
        } else {
            let index = numerosRandom.findIndex(e => e.numero === numeroRandom.numero);
            numerosRandom[index].cantidad++;
        }
    }  

    return JSON.stringify(numerosRandom);
};

process.on("message", (mensaje)=>{
    process.send(numerosRandom(mensaje));
});