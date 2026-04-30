chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request);
  
  if (request.action === 'getPrice') {
    console.log('Background: Fetching price...');
    
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        console.log('Background: Got response', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Background: Got data', data);
        if (!data.bpi || !data.bpi.USD) {
          throw new Error('Invalid API response format');
        }
        const price = data.bpi.USD.rate;
        console.log('Background: Sending price', price);
        sendResponse({ success: true, price: price });
      })
      .catch(error => {
        console.error('Background: Error', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep channel open for async response
  }
});

console.log('Background service worker loaded');
