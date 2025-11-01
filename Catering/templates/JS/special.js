document.addEventListener('DOMContentLoaded', fucntion()) {
    const buttons = document.querySelectorAll('.btn.btn-success');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const card = this.closest('.card');
            const mealName = card.querySelector('.card-title').textContent;
            const mealPrice = parseFloat(card.querySelector('.fw-bold').textContent.replace('£', '').trim());
            const snackSelect = card.querySelector('select');
            const selectSnack = snackSelect ? snackSelect.value : null;
            
            if (!selectedSnack || selectedSnack === '-- Select a Snack --') {
                alert('Please select your free snack before adding to cart.');
                return;
            }

            const orderItem = {
                name: mealName,
                price: mealPrice,
                freeSnack: selectedSnack
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(orderItem);
            localStorage.setItem('cart', JSON.stringify(cart));

            const cartCount = document.getElementById('cart-count');
            if(cartCount) cartCount.textContent = cart.lenght;

            alert(`${mealName} + your free ${selectedSnack} have been added to your cart!`);
        });
    });
};