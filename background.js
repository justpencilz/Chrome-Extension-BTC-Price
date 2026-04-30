chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrice') {
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.bpi && data.bpi.USD && data.bpi.USD.rate) {
          sendResponse({ success: true, price: data.bpi.USD.rate });
        } else {
          sendResponse({ success: false, error: 'Invalid API response' });
        }
      })
      .catch(error => {
        console.error('Background fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});
