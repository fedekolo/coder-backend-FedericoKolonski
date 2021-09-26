"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// INICIADORES
var express_1 = require("express");
var express_handlebars_1 = require("express-handlebars");
var app = (0, express_1["default"])();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment_1 = require("moment");
var fs_1 = require("fs");
// SERVIDOR / ENRUTADOR
var PORT = 8080;
var routerApi = express_1["default"].Router();
var router = express_1["default"].Router();
http.listen(PORT, function () { return console.log("Servidor escuchando en el puerto " + PORT); });
// MIDDLEWARES
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use('/api', routerApi);
app.use('/', router);
app.use(express_1["default"].static('views'));
// CONFIG DE PROCESOS
var Archivo = /** @class */ (function () {
    function Archivo(archivo) {
        this.archivo = archivo;
    }
    Archivo.prototype.listar = function () {
        return this.archivo;
    };
    Archivo.prototype.listarId = function (id) {
        var productoFiltrado = archivo.find(function (producto) { return producto.id == id; });
        return productoFiltrado == undefined ? { error: 'Producto no encontrado' } : productoFiltrado;
    };
    Archivo.prototype.guardar = function (productoBody) {
        var productoParaAgregar = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: this.archivo.length + 1
        };
        this.archivo.push(productoParaAgregar);
    };
    Archivo.prototype.actualizar = function (id, productoBody) {
        this.archivo[id - 1] = {
            title: productoBody.title,
            price: productoBody.price,
            thumbnail: productoBody.thumbnail,
            id: id
        };
        return this.archivo[id - 1];
    };
    Archivo.prototype.borrar = function (id) {
        var productoEliminado = this.archivo.filter(function (producto) { return producto.id == id; });
        this.archivo = this.archivo.filter(function (producto) { return producto.id != id; });
        return productoEliminado;
    };
    Archivo.prototype.guardarMensaje = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var archivo, archivoObj, mensajeParaAgregar, archivoActualizado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1["default"].promises.readFile('./chat.txt', 'utf-8')];
                    case 1:
                        archivo = _a.sent();
                        archivoObj = JSON.parse(archivo);
                        mensajeParaAgregar = {
                            mail: data.mail,
                            mensaje: data.mensaje,
                            fechaHora: (0, moment_1["default"])().utcOffset("-03:00").format('DD/MM/YYYY h:mm:ss a')
                        };
                        archivoObj.push(mensajeParaAgregar);
                        archivoActualizado = JSON.stringify(archivoObj, null, '\t');
                        return [4 /*yield*/, fs_1["default"].promises.writeFile('./chat.txt', archivoActualizado)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Archivo;
}());
// CONFIG HANDLEBARS
app.engine("hbs", (0, express_handlebars_1["default"])({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views"
}));
app.set('views', './views');
app.set('view engine', 'hbs');
// BASE DE DATOS
var bd = new Archivo([
    {
        "title": "Escuadra",
        "price": 123.45,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        "id": 1
    },
    {
        "title": "Calculadora",
        "price": 234.56,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        "id": 2
    },
    {
        "title": "Globo Terráqueo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        "id": 3
    }
]);
// SOCKET
io.on('connection', function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var mensajes, mensajesObj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Refrescar productos
                socket.on('refrescar', function (data) {
                    io.sockets.emit('productoNuevo', data);
                });
                return [4 /*yield*/, fs_1["default"].promises.readFile('./chat.txt', 'utf-8')];
            case 1:
                mensajes = _a.sent();
                mensajesObj = JSON.parse(mensajes);
                io.sockets.emit('mensajes', mensajesObj);
                socket.on('nuevo', function (data) { return __awaiter(void 0, void 0, void 0, function () {
                    var bdMensajes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bdMensajes = new Archivo(mensajesObj);
                                return [4 /*yield*/, bdMensajes.guardarMensaje(data)];
                            case 1:
                                _a.sent();
                                io.sockets.emit('mensajes', mensajesObj);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
// RUTAS
router.get('/', function (req, res) {
    res.redirect('/api/productos/agregar');
});
routerApi.get('/productos/vista', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var archivo, sinProductos, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bd.listar()];
            case 1:
                archivo = _a.sent();
                sinProductos = archivo.length == 0 ? true : false;
                res.render('index', { producto: archivo, sinProductos: sinProductos });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
routerApi.get('/productos/agregar', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var archivo, sinProductos, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bd.listar()];
            case 1:
                archivo = _a.sent();
                sinProductos = archivo.length == 0 ? true : false;
                res.render('add', { producto: archivo, sinProductos: sinProductos });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
routerApi.post('/productos/guardar', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productoBody, archivo, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productoBody = req.body;
                return [4 /*yield*/, bd.guardar(productoBody)];
            case 1:
                archivo = _a.sent();
                res.redirect('/api/productos/agregar');
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
routerApi.put('/productos/actualizar/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, productoBody, archivo, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = req.params;
                productoBody = req.body;
                return [4 /*yield*/, bd.actualizar(params.id, productoBody)];
            case 1:
                archivo = _a.sent();
                res.json(archivo);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
routerApi["delete"]('/productos/borrar/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, archivo, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = req.params;
                return [4 /*yield*/, bd.borrar(params.id)];
            case 1:
                archivo = _a.sent();
                res.json(archivo);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
