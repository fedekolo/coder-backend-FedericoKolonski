const operacion = (num1: number, num2: number, tipo: string): any => {

    return new Promise ((resolve,reject)=>{
        if (tipo=="suma" || tipo=="resta") {
            tipo=="suma" ? resolve(num1+num2) : resolve(num1-num2);
        } else {
            reject("Error en el tipo")
        }
    })
}

const operaciones = async (num1: number, num2: number, tipo: string) => {
    
    return await operacion(num1, num2, tipo)
    .then((resultado:number) => console.log(resultado))
    .catch((error:string) => console.log(error))

}

class Calculo {

    #num1
    #num2
    #tipo

    constructor(num1:number,num2:number,tipo:string) {
        this.#num1 = num1;
        this.#num2 = num2;
        this.#tipo = tipo;
    }

    getResultado() {
        return operaciones(this.#num1,this.#num2,this.#tipo)
    }

}

let calculo1: any = new Calculo(10,20,"suma");
let calculo2: any = new Calculo(30,20,"resta");
let calculo3: any = new Calculo(20,20,"division");