import { supabase } from './auth.js';


// Revisar sesión activa, si no hay, redirigir a login
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
  window.location.href = 'login.html';
}

const productsDiv = document.getElementById('products');
const cartList = document.getElementById('cart');
const totalSpan = document.getElementById('total');
const logoutBtn = document.getElementById('logoutBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = [];

// Cargar productos desde Supabase
async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    alert('Error al cargar productos: ' + error.message);
    return;
  }

  productsDiv.innerHTML = '';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';

    col.innerHTML = `
      <div class="card h-100" data-id="${product.id}">
        <img src="${product.image_url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">S/ ${product.price.toFixed(2)}</p>
          <button class="btn btn-primary mt-auto add-to-cart-btn">Agregar al carrito</button>
        </div>
      </div>
    `;

    productsDiv.appendChild(col);
  });

  // Agregar event listener a todos los botones "Agregar al carrito"
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.closest('.card').dataset.id);
      addToCart(productId);
    });
  });
}

// Añadir producto al carrito
function addToCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  renderCart();
}

async function renderCart() {
  const ids = cart.map(i => i.id);
  const cartItemsContainer = document.getElementById('cart-items');

  if (ids.length === 0) {
    cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
    totalSpan.textContent = '0.00';
    document.getElementById('cart-count').textContent = '0';
    return;
  }

  const { data: products, error } = await supabase.from('products').select('*').in('id', ids);
  if (error) {
    alert('Error cargando productos del carrito: ' + error.message);
    return;
  }

  cartItemsContainer.innerHTML = '';

  let total = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const subtotal = product.price * item.qty;
    total += subtotal;
    totalQty += item.qty;

    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
    div.innerHTML = `
      <div>
        <strong>${product.name}</strong><br>
        x${item.qty} - S/ ${subtotal.toFixed(2)}
      </div>
      <button class="btn btn-sm btn-danger">-</button>
    `;

    div.querySelector('button').onclick = () => removeFromCart(item.id);

    cartItemsContainer.appendChild(div);
  });

  totalSpan.textContent = total.toFixed(2);
  document.getElementById('cart-count').textContent = totalQty;
}


// Reducir cantidad o eliminar del carrito
function removeFromCart(productId) {
  const index = cart.findIndex(i => i.id === productId);
  if (index !== -1) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    renderCart();
  }
}

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = 'login.html';
});


// Botón de pago (implementación real con productos del carrito)
checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  // Obtener los productos desde Supabase
  const ids = cart.map(i => i.id);
  const { data: products, error } = await supabase.from('products').select('*').in('id', ids);
  if (error) {
    alert('Error al obtener productos: ' + error.message);
    return;
  }

  // Crear el arreglo de productos con nombre, cantidad y precio
  const orderItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return {
      title: product.name,
      quantity: item.qty,
      unit_price: Number(product.price),  // Asegurarse de que sea número
      currency_id: "PEN",
    };
  });

  try {
    const res = await fetch('http://localhost:3001/create-order', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: orderItems
      })
    });

    if (!res.ok) {
      throw new Error(`Error en la solicitud: ${res.status}`);
    }

    const data = await res.json();
    window.location.href = data.init_point; // Redirige a MercadoPago
  } catch (error) {
    console.error('Error durante el checkout:', error);
    alert('Hubo un error al crear la orden de pago.');
  }
});



const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');

cartToggle.addEventListener('click', () => {
  cartPanel.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.length;
}

updateCartCount(); // Llama esto cuando se carga la página


// Al iniciar la página, cargar productos y carrito
loadProducts();
renderCart();
