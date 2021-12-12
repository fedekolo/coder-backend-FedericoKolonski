// PANTALLA INDEX
const productos = async () => {
    const productos = await fetch('/productos/listar')
    .then(res => res.json())
    .catch(err => console.log(err));

    const isAdmin = await fetch('/admin')
    .then(res => res.json())
    .catch(err => console.log(err));

    console.log(productos)

    let html = productos.map((p) => 
        `
        <div class="card" style="width: 18rem;">
            <img src="${p.foto}" class="card-img-top" alt="${p.nombre}">
            <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${p.descripcion}</p>
            <h5 class="card-title">$${p.precio}</h5>
            <a onclick="agregarCarrito(${p.id})" class="btn btn-secondary">Agregar al carrito</a>
            ${isAdmin ? `<div class="btn-productos">
                            <a onclick="pantallaEdit(${p.id})" class="btn btn-primary">Editar</a>
                            <a onclick="eliminarProducto(${p.id})" class="btn btn-danger">Eliminar</a>
                        </div>` : ` `}
            </div>
        </div>
        `
    ).join(' ');

    document.getElementById('productos').innerHTML = html;
}

const agregarCarrito = async (id) => {
    await fetch(`/carrito/agregar/${id}`,{method: 'POST'})
    .then(alert('Producto agregado con éxito al carrito'))
    .catch(err => console.log(err));
}

const eliminarProducto = async (id) => {
    await fetch(`/productos/borrar/${id}`,{method: 'DELETE'})
    .then(alert('Producto eliminado con éxito'),window.location.href ='index.html')
    .catch(err => console.log(err));
}

// EXTRA EDITAR PRODUCTO
const pantallaEdit = async (id) => {
    const productoEdit = await fetch(`/productos/listar/${id}`)
    .then(res => res.json())
    .catch(err => console.log(err));

    document.getElementById('edit-productos').style.display = 'block';
    document.getElementById('nombre').value = productoEdit.nombre;
    document.getElementById('descripcion').value = productoEdit.descripcion;
    document.getElementById('codigo').value = productoEdit.codigo;
    document.getElementById('foto').value = productoEdit.foto;
    document.getElementById('precio').value = productoEdit.precio;
    document.getElementById('stock').value = productoEdit.stock;
    document.getElementById('edit-form').setAttribute('action', `productos/actualizar/${productoEdit.id}`);
};

// PANTALLA CARRITO
const carrito = async () => {
    const productos = await fetch('/carrito/listar')
    .then(res => res.json())
    .catch(err => console.log(err));

    let html = productos.map((p) => 
        `
        <div class="card" style="width: 18rem;">
            <img src="${p.foto}" class="card-img-top" alt="${p.nombre}">
            <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${p.descripcion}</p>
            <h5 class="card-title">$${p.precio}</h5>
            <div class="btn-productos">
                <a onclick="eliminarCarrito(${p.id})" class="btn btn-danger">Eliminar</a>
            </div>
            </div>
        </div>
        `
    ).join(' ');

    document.getElementById('productos').innerHTML = html;
}

const eliminarCarrito = async (id) => {
    await fetch(`/carrito/borrar/${id}`,{method: 'DELETE'})
    .then(alert('Producto eliminado con éxito del carrito'),window.location.href ='carrito.html')
    .catch(err => console.log(err))
}

// MENU GENERAL, TODAS LAS PANTALLAS
const menuAdmin = async () => {
    const isAdmin = await fetch('/admin')
    .then(res => res.json())
    .catch(err => console.log(err));
    
    if (isAdmin) {
        const menu = document.getElementById('items-menu')
        
        menu.insertAdjacentHTML('beforeend',`
            <li class="nav-item">
                <a class="nav-link" href="/add.html">Agregar producto</a>
            </li>`)
    }
}