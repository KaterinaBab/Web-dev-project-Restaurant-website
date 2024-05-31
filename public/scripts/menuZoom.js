window.addEventListener("scroll", function() {
    var Homebar = document.querySelector(".Homebar");
    Homebar.classList.toggle("zoomed", window.scrollY > 0);
});