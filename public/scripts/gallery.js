document.addEventListener('DOMContentLoaded', function() {
    let next = document.querySelector('.next')
    let prev = document.querySelector('.prev')
    console.log(next);
    
    let intervalFunction = function() {
        // Your command or function to execute every 3 seconds goes here
        let items2 = document.querySelectorAll('.item')
        document.querySelector('.slide').appendChild(items2[0]);
      };
    
      // Setting the interval initially
    let intervalId = setInterval(intervalFunction, 4000);
    
    next.addEventListener('click', function(){
        let items = document.querySelectorAll('.item')
        document.querySelector('.slide').appendChild(items[0])
        clearInterval(intervalId);
    
        // Set a new interval
        intervalId = setInterval(intervalFunction, 4000);
    })
    
    prev.addEventListener('click', function(){
        let items = document.querySelectorAll('.item')
        document.querySelector('.slide').prepend(items[items.length - 1]) // here the length of items = 6
    })
    
    const hiddenElements = document.querySelectorAll('.hidden-text');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    hiddenElements.forEach(element => {
        observer.observe(element);
    });
    
    });