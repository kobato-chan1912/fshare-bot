import puppeteer from 'puppeteer-core';
import axios from 'axios';
const profile = 153688686;



(async () => {

    let endpoint = await axios.get(`http://localhost:3001/v1.0/browser_profiles/${profile}/start?automation=1`);
    let wsData = await endpoint.data;
    let port = wsData.automation.port;
    let wsEndpoint = wsData.automation.wsEndpoint;

    const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://127.0.0.1:${port}${wsEndpoint}`,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();

      // Navigate to the page where you want to send the AJAX-like request
  await page.goto('https://example.com');

  // Use page.evaluate to execute JavaScript in the page's context
  const ajaxResult = await page.evaluate(() => {
    // Simulate an AJAX request using the fetch API or XMLHttpRequest
    return fetch('https://httpbin.org/ip')
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
        return null;
      });
  });

  console.log('AJAX-like Result:', ajaxResult);


})();