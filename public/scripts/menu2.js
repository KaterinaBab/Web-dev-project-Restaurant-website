document.getElementById("openForm0").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm0").style.display = "block";
  document.getElementById("overlay0").style.display = "block"; // Show the overlay
  document.getElementById("overlay0").classList.add("blur"); // Apply blur to the body
});
/*
document.getElementById("popupForm0").addEventListener("submit", function(event) {
  // Prevent the default form submission
  event.preventDefault();
  
  // Handle form submission logic here
  // For example, you can use AJAX to submit the form data
  // Once the form is submitted, you may want to close the popup form and hide the overlay
  document.getElementById("popupForm0").style.display = "none";
  document.getElementById("overlay0").style.display = "none"; // Hide the overlay
  document.getElementById("overlay0").classList.remove("blur"); // Remove the blur from the body
}); */

document.getElementById("openForm1").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm1").style.display = "block";
  document.getElementById("overlay1").style.display = "block"; // Show the overlay
  document.getElementById("overlay1").classList.add("blur"); // Apply blur to the body
});



document.getElementById("openForm2").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm2").style.display = "block";
  document.getElementById("overlay2").style.display = "block"; // Show the overlay
  document.getElementById("overlay2").classList.add("blur"); // Apply blur to the body
});


document.getElementById("openForm3").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm3").style.display = "block";
  document.getElementById("overlay3").style.display = "block"; // Show the overlay
  document.getElementById("overlay3").classList.add("blur"); // Apply blur to the body
});



document.getElementById("openForm4").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm4").style.display = "block";
  document.getElementById("overlay4").style.display = "block"; // Show the overlay
  document.getElementById("overlay4").classList.add("blur"); // Apply blur to the body
});



document.getElementById("openForm5").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default behavior of the button
  document.getElementById("popupForm5").style.display = "block";
  document.getElementById("overlay5").style.display = "block"; // Show the overlay
  document.getElementById("overlay5").classList.add("blur"); // Apply blur to the body
});



for (let i = 0; i <= 5; i++) {
  // Construct the button and form IDs
  const buttonId = `cancel-btn${i}`;
  const formId = `popupForm${i}`;
  const titleId = `title${i}`;
  const extrasId = `extras${i}`;
  const priceId = `price${i}`;

  // Get the button and form elements
  const button = document.getElementById(buttonId);
  const form = document.getElementById(formId);

  const val1 = document.getElementById(titleId);
  const val2 = document.getElementById(extrasId);
  const val3 = document.getElementById(priceId);

  // Check if the button and form exist
  if (button && form) {
      // Add an event listener to the button
      button.addEventListener('click', function(event) {
          event.preventDefault();
          // Toggle the display of the corresponding form
          if (form.style.display === 'none' || form.style.display === '') {
              form.style.display = 'block';
          } else {
              document.getElementById(`popupForm${i}`).style.display = "none";
              document.getElementById(`overlay${i}`).style.display = "none"; // Hide the overlay
              document.getElementById(`overlay${i}`).classList.remove("blur"); // Remove the blur from the body
              val3.value = '';
              val2.value = '';
              val1.value = '';
              form.style.display = 'none';
              
          }
      });
  }
}
for (let idd = 0; idd <= 100; idd++) {
  const buttonId = `editPlate${idd}`;
  const formId = `editForm${idd}`;
  //const cancelBtnId = `cancelEdit${idd}`;

  

  // Get the button and form elements
  const button = document.getElementById(buttonId);
  const form = document.getElementById(formId);
  //const cancelbtn = document.getElementById(cancelBtnId);

  
  const titleId = `title${idd}`;
  const extrasId = `extras${idd}`;
  const priceId = `price${idd}`;
  

  if (button && form) {
      const val1 = document.getElementById(titleId);
      const val2 = document.getElementById(extrasId);
      const val3 = document.getElementById(priceId); 
      const init1 = val1.value;
      const init2 = val2.value;
      const init3 = val3.value;
      
      // Add an event listener to the button
      button.addEventListener('click', function(event) {
          event.preventDefault();
          // Toggle the display of the corresponding form
          if (form.style.display === 'none' || form.style.display === '') {
              form.style.display = 'flex';
          } else {
              val3.value = init3;
              val2.value = init2;
              val1.value = init1;
              form.style.display = 'none';
              
          }
      });
  
  console.log('id ' + idd);
}}

for (let id = 0; id <= 100; id++) {
  // Construct the button and form IDs
  const buttonId = `editPlate${id}`;
  const formId = `editForm${id}`;
  const cancelBtnId = `cancelEdit${id}`;

  

  // Get the button and form elements
  const button = document.getElementById(buttonId);
  const form = document.getElementById(formId);
  const cancelbtn = document.getElementById(cancelBtnId);

  
  const titleId = `title${id}`;
  const extrasId = `extras${id}`;
  const priceId = `price${id}`;
  const val1 = document.getElementById(titleId);
  const val2 = document.getElementById(extrasId);
  const val3 = document.getElementById(priceId); 
  const init1 = val1.value;
  const init2 = val2.value;
  const init3 = val3.value;
  console.log('id ' + id)
  // Check if the button and form exist
  if (button && form && cancelbtn) {
      
      // Add an event listener to the button
      button.addEventListener('click', function(event) {
          event.preventDefault();

          // Toggle the display of the corresponding form
          if (form.style.display === 'none' || form.style.display === '') {
              form.style.display = 'flex';
          } else {
              val3.value = init1;
              val2.value = init2;
              val1.value = init3;
              form.style.display = 'none';
              
          }
      });

      button.addEventListener('click', function(event) {
          event.preventDefault();
          // Toggle the display of the corresponding form
          if (form.style.display === 'none' || form.style.display === '') {
              form.style.display = 'block';
          } else {
              document.getElementById(`popupForm${i}`).style.display = "none";
              document.getElementById(`overlay${i}`).style.display = "none"; // Hide the overlay
              document.getElementById(`overlay${i}`).classList.remove("blur"); // Remove the blur from the body
              val3.value = '';
              val2.value = '';
              val1.value = '';
              form.style.display = 'none';
              
          }
      });
  }
}