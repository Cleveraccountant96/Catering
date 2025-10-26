// checkout.js

const cartTableBody = document.querySelector('#cart-table tbody');
const totalEl = document.getElementById('total');
const payBtn = document.getElementById('pay-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCheckoutCart() {
  cartTableBody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>£${item.price.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button></td>
    `;
    cartTableBody.appendChild(row);
  });

  totalEl.textContent = total.toFixed(2);
  payBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
  localStorage.setItem('cartTotal', total.toFixed(2));
}

// Remove item
cartTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckoutCart();
  }
});

// Proceed to billing
payBtn.addEventListener('click', () => {
  window.location.href = 'billing.html';
});

// Initial render
renderCheckoutCart();
