document.querySelectorAll('ul.navbar-list li').forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' class from all navbar items
        console.log('Navbar item clicked');
        document.querySelectorAll('ul.navbar-list li').forEach(navItem => {
            navItem.classList.remove('active');
        });
        // Add 'active' class to the clicked navbar item
        item.classList.add('active');
    });
});

function toggleNavbar() {
    var navbarList = document.querySelector('.navbar-list');
    if (navbarList.classList.contains('show')) {
        navbarList.classList.remove('show');
    } else {
        navbarList.classList.add('show');
    }
  }
/*
document.addEventListener('DOMContentLoaded', function() {
    // Select the element with the class 'btn1'
    const button = document.querySelector('.dropbtn-user');

    // Check if the element exists to avoid errors
    if (button) {
        // Add a click event listener to the button
        button.addEventListener('hover', function() {
            const dpg = document.querySelector('.dropdown-content');
            dpg.style.display = 'flex';
        });
    }
}); */