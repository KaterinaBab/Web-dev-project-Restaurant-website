document.addEventListener('DOMContentLoaded', function() {
    const customerSelect = document.getElementById('customer');
    const guestNameInput = document.getElementById('guest-name');

    customerSelect.addEventListener('change', function() {
        if (customerSelect.value !== 'default') {
            guestNameInput.disabled = true;
        } else {
            guestNameInput.disabled = false;
        }
    });

    guestNameInput.addEventListener('input', function() {
        if (guestNameInput.value.trim() !== '') {
            customerSelect.disabled = true;
        } else {
            customerSelect.disabled = false;
        }
    });
});
