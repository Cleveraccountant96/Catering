// Function to update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? 'inline-block' : 'none'; // hide if 0
  }
}

// Update count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Update count whenever an item is added
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart')) {
    const name = e.target.getAttribute('data-name');
    const price = parseFloat(e.target.getAttribute('data-price'));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
  }
  
});
// Select all Add-to-Cart buttons
  const cartButtons = document.querySelectorAll('.add-to-cart');

  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Add "btn-white" class to change its appearance
      button.classList.add('btn-white');

      // Optional: Disable the button after adding to cart
      // button.disabled = true;
    });
  })
