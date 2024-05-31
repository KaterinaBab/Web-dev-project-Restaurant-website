async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

/*
// Event listener for form submission
document.getElementById('log-in-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pwd').value;
    const password2 = document.getElementById('pwd2').value;
    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }
    //const salt = generateRandomString(6);
    //const hashedPassword = await hashPassword(password);

    try {
        const response = await fetch('/create_acc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password})
        });
        if (response.ok) {
            console.log('Registration successful');
            // Optionally, handle successful registration response
        } else {
            console.error('Registration failed');
            // Optionally, handle failed registration response
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, handle error
    }
}); */

/*
const submitButton = document.getElementById('submit-button');

// Add event listener to the submit button
submitButton.addEventListener('click', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault(); // Prevent default form submission behavior
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pwd').value;
    const password2 = document.getElementById('pwd2').value;
    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }
//const salt = generateRandomString(6);
//const hashedPassword = await hashPassword(password);

    try {
        const response = await fetch('/create_acc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            console.log('Registration successful');
            // Optionally, handle successful registration response
        } else {
            console.error('Registration failed');
            // Optionally, handle failed registration response
        }
    }
    catch (error) {
        console.error('Error:', error);
        // Optionally, handle error
    }
}); */


document.addEventListener('DOMContentLoaded', async function() {
    // Find the form element
    const form = document.getElementById('log-in-form');

    // Add event listener for the form submission
    form.addEventListener('submit', async function(event) {
        // Prevent the default form submission behavior
        event.preventDefault(); // Prevent default form submission behavior
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('pwd').value;
        const password2 = document.getElementById('pwd2').value;
        console.log('Hi')
        
    //const salt = generateRandomString(6);
    //const hashedPassword = await hashPassword(password);

    try {
        x = JSON.stringify({ username, email, password });
        const response = await fetch('/create_acc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: x
        });
        if (response.ok) {
            console.log('Registration successful');
            // Optionally, handle successful registration response
        } else {
            console.error('Registration failed');
            // Optionally, handle failed registration response
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, handle error
    }
    })});