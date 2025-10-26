// billing.js
document.addEventListener('DOMContentLoaded', () => {
// Load total from checkout
const total = localStorage.getItem('cartTotal') || "0.00";
document.getElementById('billing-total').textContent = total;

// Collect customer info
const form = document.getElementById('billing-form');

// Render PayPal button
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: { value: total }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      // Collect minimal billing info
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const address = document.getElementById('address').value;

      // Save order (without sensitive card info)
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const order = {
        cart,
        billing: { name, email, address },
        total: parseFloat(total),
        date: new Date().toISOString(),
        paymentStatus: 'Paid via PayPal',
        payerName: details.payer.name.given_name
      };

      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart and total
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotal');

      alert('Payment successful! Thank you for your order, ' + details.payer.name.given_name + '.');
      window.location.href = "home.html"; // Redirect after payment
    });
  }
}).render('#paypal-button-container');
});