const socket = io();

const refrescarListado = () => {
    const title = document.getElementById('floatingTitle').value;
    const price = document.getElementById('floatingPrice').value;
    const thumbnail = document.getElementById('floatingThumbnail').value;
    const productoNuevo = {title:title,price:price,thumbnail:thumbnail};
    title=="" || price=="" || thumbnail=="" ? alert("Faltan campos por completar") : socket.emit('refrescar',productoNuevo);
};

socket.on('productoNuevo',(producto) => {
    const listadoProductos = document.getElementById('listado-productos');
    listadoProductos.insertAdjacentHTML('beforeend',`
    <tr>
        <td>${producto.title}</td>
        <td>$${producto.price}</td>
        <td><img src="${producto.thumbnail}" alt="${producto.title}"style="height: 30px;"></td>
    </tr>`)
})