const socket = io();

const refrescarListado = () => {
    const title = document.getElementById('floatingTitle').value;
    const price = document.getElementById('floatingPrice').value;
    const thumbnail = document.getElementById('floatingThumbnail').value;
    const productoNuevo = {title:title,price:price,thumbnail:thumbnail};
    title=="" || price=="" || thumbnail=="" ? alert("Faltan campos por completar") : socket.emit('refrescar',productoNuevo);
};

// SOCKET
// Agregar producto nuevo
socket.on('productoNuevo',(producto) => {
    const listadoProductos = document.getElementById('listado-productos');
    listadoProductos.insertAdjacentHTML('beforeend',`
    <tr>
        <td>${producto.title}</td>
        <td>$${producto.price}</td>
        <td><img src="${producto.thumbnail}" alt="${producto.title}"style="height: 30px;"></td>
    </tr>`)
});

// Chat de usuarios
socket.on('mensajes', (data) => {
    render(data);
});

let render = (data) => {
    let html = 
    data.map((m) => 
        `
        <div class="fila" style="margin: 15px auto;">
            <strong style="color: blue;" id: "mail">${m.mail}</strong>
            <em style="color: brown;" id: "fechaHora">[${m.fechaHora}]:</em>
            <i style="color: green;" id: "mensaje">${m.mensaje}</i>
        </div>
        `
    ).join(' ');
    document.getElementById('mensajes').innerHTML = html;
};

const envioMensaje = (f) => {
    let mail = document.getElementById('mail').value;
    let mensaje = document.getElementById('mensaje').value;
    socket.emit('nuevo',{mail, mensaje});
};

const refrescarChat = () => {
    const title = document.getElementById('floatingTitle').value;
    const price = document.getElementById('floatingPrice').value;
    const thumbnail = document.getElementById('floatingThumbnail').value;
    const productoNuevo = {title:title,price:price,thumbnail:thumbnail};
    title=="" || price=="" || thumbnail=="" ? alert("Faltan campos por completar") : socket.emit('refrescar',productoNuevo);
};