class Calculo {

    _num1
    _num2
    _tipo

    constructor(num1,num2,tipo) {
        this._num1 = num1;
        this._num2 = num2;
        this._tipo = tipo;
    }

    getResultado() {
        if (this._tipo == "suma") {
            return this._num1 + this._num2;
        } else {
            return this._num1 - this._num2;
        }
    }
}

export default Calculo;