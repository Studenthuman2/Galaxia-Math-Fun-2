let contenedor = document.getElementById('container')
let productos = [];
async function myJson() {
  try {
    const response = await fetch('../js/datos.json');
    const dataJson = await response.json();
    productos = dataJson.productos;
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}
myJson();

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


const productContainer = document.getElementById('product-container');
const itemsCarrito = document.getElementById('items-carrito');
const precioTotal = document.getElementById('precio-total');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoSeccion = document.getElementById('carrito');



function renderizarProductos() {
 const categoria = productContainer.getAttribute("data-categoria");
   const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
   productContainer.innerHTML = '';
   productosFiltrados.forEach(producto => {
       const productCard = document.createElement('div');
       productCard.classList.add('product-card');
       productCard.innerHTML = `
           <img src="${producto.imagen}" alt="${producto.nombre}">
           <h3>${producto.nombre}</h3>
           <p>Precio: $${producto.precio}</p>
           <button onClick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
       `;
    productContainer.appendChild(productCard);
  });
} 



// agregar productos y sumar toastify 

function agregarAlCarrito(id){
  const producto = productos.find(item => item.id === id);
  carrito.push(producto);
  actualizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
  Toastify({
    text:`${producto.nombre}, agregado al carrito`,
    duration:1000,
    gravity:"top",
    position:"right",
    background: "yellow", 
}).showToast();
}


function eliminarDelCarrito(indice){
  carrito.splice(indice, 1);
  actualizarCarrito()
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito(){
  renderizarCarrito();
  actualizarTotal();
  actualizarContador();
}


function renderizarCarrito(){
  itemsCarrito.innerHTML = '';
  carrito.forEach((item, indice) => {
      const li = document.createElement('li');
      li.innerHTML = `
         ${item.nombre} - $${item.precio}
         <button onclick="eliminarDelCarrito(${indice})"> X </button>
      `;
      itemsCarrito.appendChild(li)
  });
}

//actualizacion

function actualizarTotal(){
  const total = carrito.reduce((acum, item) => acum + item.precio,0);
  precioTotal.textContent = `${total}`;
}


function actualizarContador(){
  contadorCarrito.textContent = carrito.length;
}


function alternarCarrito(){
  carritoSeccion.style.display = carritoSeccion.style.display === 'none' || carritoSeccion.style.display === '' ? 'block' : 'none';
}

function finalizarCompra(){
  if(carrito.length === 0){
      Swal.fire({
          icon: 'warning',
          title: 'carrito vacio',
          text: 'no hay productos, todavia'
      })
  } else{
      Swal.fire({
          icon: 'success',
          title: 'Compra realizada',
          text: 'gracias por tu compra'

      }).then(()=> {
          carrito.length = 0;
          localStorage.removeItem('carrito');
          actualizarCarrito()
      })
  }
}

actualizarCarrito(); 
renderizarProductos();

