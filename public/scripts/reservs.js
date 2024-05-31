function setMinDate() {
    var today = new Date().toISOString().split('T')[0];
    var dateInput = document.getElementById('date');
    dateInput.setAttribute('min', today);

    // Highlight today on initial load
    highlightDate();

    dateInput.addEventListener('input', function() {
        highlightDate();
    });

    function highlightDate() {
        var selectedDate = dateInput.value;
        var todayDate = new Date().toISOString().split('T')[0];

        if (selectedDate) {
            if (selectedDate === todayDate) {
                dateInput.classList.add('today');
                dateInput.classList.remove('selected-date');
            } else {
                dateInput.classList.add('selected-date');
                dateInput.classList.remove('today');
            }
        } else {
            dateInput.classList.remove('selected-date', 'today');
        }
    }
}

document.addEventListener('DOMContentLoaded', setMinDate);
