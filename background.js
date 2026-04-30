chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrice') {
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => response.json())
      .then(data => {
        const price = data.bpi.USD.rate;
        sendResponse({ success: true, price: price });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
});
