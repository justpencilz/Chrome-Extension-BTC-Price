async function updatePrice() {
  const priceElement = document.getElementById('price');
  priceElement.textContent = 'Loading...';
  
  try {
    // Request price from background service worker
    const response = await chrome.runtime.sendMessage({ action: 'getPrice' });
    if (response.success) {
      priceElement.textContent = `Current Price: $${response.price}`;
    } else {
      priceElement.textContent = `Error: ${response.error}`;
    }
  } catch (error) {
    priceElement.textContent = 'Error loading price';
    console.error('Error:', error);
  }
}

updatePrice();
