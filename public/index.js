document.addEventListener('DOMContentLoaded', () => {
  loadInitialData();
  // set click action, processing search funciton when the user click the button
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  // clear the property type input field everytime when the user click
  document.getElementById('property_type').addEventListener('click', function() {
    this.value = '';
  });
  // clear the location input field everytime when the user click
  document.getElementById('address.market').addEventListener('click', function() {
    this.value = '';
  });
  
});
// loading intial data on the home page
function loadInitialData() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('data-container');
      const selectedData = data.slice(0, 20);
      updateTable(selectedData);
    })
    .catch(error => console.error('Failed to fetch data', error));
}
// search function with 3 conditions
function handleSearch() {
  const market = document.getElementById('address.market').value.trim();
  const propertyType = document.getElementById('property_type').value.trim();
  const bedrooms = document.getElementById('bedrooms').value.trim();
  //set location input as mandatory input field when searching, and raise alert when applied
  if (!market) {
    alert('Please enter a location for searching.'); 
    document.getElementById('address.market').focus(); 
    return; 
  }

  const queryParams = new URLSearchParams();
  if (market) queryParams.append('market', market);
  if (propertyType) queryParams.append('property_type', propertyType);
  if (bedrooms) queryParams.append('bedrooms', bedrooms);
  // keep the current displaying lisitngs when no filter conditions input
  if (!market && !propertyType && !bedrooms) {
    loadInitialData();
    return;
  }
  // get the filter conditions as query
  fetch(`/api/search?${queryParams.toString()}`)
    .then(response => response.json())
    .then(data => {
      updateTable(data);
    })
    .catch(error => console.error('Failed to fetch search results', error));
}

// refresh the displaying table
function updateTable(data) {
  const container = document.getElementById('data-container');
  container.innerHTML = ''; 
  // set each data with class name for css style
  data.forEach(item => {
    const block = document.createElement('div');
    block.className = 'data-block'; 
    // set hypelink for each listing
    const link = document.createElement('a');
    link.href = `/bookings.html?listing_id=${item._id}`; 
    link.className = 'link';

    const title = document.createElement('h3');
    title.textContent = item.name;
    link.appendChild(title);

    const summary = document.createElement('p');
    summary.className = 'summary'
    summary.textContent = item.summary;

    const price = document.createElement('p');
    price.className = 'price'
    price.textContent = `Price: ${item.price.$numberDecimal}`; 

    const rating = document.createElement('p');
    rating.className = 'rating'
    rating.textContent = `Customer Rating: ${item.review_scores.review_scores_rating}`;

    block.appendChild(link);
    block.appendChild(summary);
    block.appendChild(price);
    block.appendChild(rating);

    container.appendChild(block);
  });
}