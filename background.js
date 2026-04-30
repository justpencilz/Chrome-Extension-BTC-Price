chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request);
  
  if (request.action === 'getPrice') {
    console.log('Background: Fetching Bitcoin price...');
    
    // Try multiple APIs in case one fails
    const apis = [
      'https://api.coindesk.com/v1/bpi/currentprice.json',
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    ];
    
    async function tryFetch() {
      for (let url of apis) {
        try {
          console.log(`Background: Trying ${url}`);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.log(`Background: ${url} returned ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log('Background: Data received', data);
          
          let price;
          if (data.bpi && data.bpi.USD) {
            // CoinDesk format
            price = data.bpi.USD.rate;
          } else if (data.bitcoin && data.bitcoin.usd) {
            // CoinGecko format
            price = data.bitcoin.usd;
          } else {
            continue;
          }
          
          console.log('Background: Price found:', price);
          sendResponse({ success: true, price: price });
          return;
        } catch (error) {
          console.log(`Background: ${url} failed:`, error.message);
          continue;
        }
      }
      
      // All APIs failed
      console.error('Background: All APIs failed');
      sendResponse({ success: false, error: 'Unable to fetch Bitcoin price' });
    }
    
    tryFetch();
    return true; // Keep channel open for async response
  }
});

console.log('Background service worker loaded');
