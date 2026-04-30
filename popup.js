async function updatePrice() {
  const priceElement = document.getElementById('price');
  priceElement.textContent = 'Loading...';
  
  try {
    // Request price from background service worker with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    );
    
    const response = await Promise.race([
      chrome.runtime.sendMessage({ action: 'getPrice' }),
      timeoutPromise
    ]);
    
    if (response && response.success) {
      priceElement.textContent = `Current Price: $${response.price}`;
    } else {
      priceElement.textContent = `Error: ${response?.error || 'Unknown error'}`;
    }
  } catch (error) {
    priceElement.textContent = `Error: ${error.message}`;
    console.error('Popup error:', error);
  }
}

updatePrice();
