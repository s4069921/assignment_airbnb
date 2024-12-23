// Submit the form when the user clicks the 'Book Now' button
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  // get each value from client side
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  // if the mandatory input field are null, raise the error message
  if (!checkin || !checkout || !name || !email || !mobile ) {
    bookingForm.classList.add('was-validated');
    return;
  }
  // check in date should be at least the current date, and raise alert when applied
  if (checkin <= new Date()){
    alert('Check-in date cannot be earlier than the current date.');
    document.getElementById('checkin').focus(); 
    return;
  }
  // check out date should be after the check in date, and raise alert when applied
  if (checkin > checkout) {
    alert('Check-out date must be after the check-in date.');
    return;
  }
  // check the eamil addres, and raise alert when applied
  if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
    alert("Please provide a valid email address.");
    document.getElementById('email').focus();
    return;
  }
  // get the listing ID from the hypelink
  const urlParams = new URLSearchParams(window.location.search);
  const listingID = urlParams.get('listing_id');

  if (bookingForm.checkValidity()) {
    try {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const mobile = document.getElementById('mobile').value;
      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const postal = document.getElementById('postal').value;
      const residential = document.getElementById('residential').value;
      const bookingID = new Date().toLocaleDateString() + '_' + listingID;

      // Send a POST request to the API endpoint
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingID, bookingID, name, email, mobile, checkin, checkout, postal, residential })
      });

      // Redirect to the home page after submitting the form
      if (response.ok) {
        console.log('Data saved successfully');
        window.location.href = './success.html';
      }
      console.log('Redirecting...');
    } catch (error) {
      console.error(error);
    }
  } else {
    bookingForm.classList.add('was-validated');
  }
});