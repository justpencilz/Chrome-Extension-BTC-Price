chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request);
  
  if (request.action === 'getPrice') {
    console.log('Background: Fetching from CoinDesk...');
    
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        console.log('Background: Response status', response.status);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Background: Data received', data);
        if (data && data.bpi && data.bpi.USD && data.bpi.USD.rate) {
          const price = data.bpi.USD.rate;
          console.log('Background: Price found:', price);
          sendResponse({ success: true, price: price });
        } else {
          throw new Error('Invalid response structure');
        }
      })
      .catch(error => {
        console.error('Background: Fetch error:', error.message);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep channel open for async response
  }
});

console.log('Background service worker loaded');
