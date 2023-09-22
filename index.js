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


    /*** 1. Login To The Fshare ***/
    await page.goto('https://fshare.vn')
    await page.goto('https://www.fshare.vn/site/auth?authclient=google');

    try {
        await page.waitForSelector('.wLBAL', { timeout: 5000 })
        console.log("Login: Xuất hiện màn hình đăng nhập")
        await page.click('.wLBAL')
    } catch (error) {
        console.log("Login: Không xuất hiện màn hình đăng nhập")
    }

    // await new Promise(r => setTimeout(r, 5000));
    // await page.screenshot({ path: 'full.png', fullPage: true });

    /*** 2. Wait For Login Is Done  ***/

    await page.waitForSelector('.user__profile')
    await new Promise(r => setTimeout(r, 5000));
    console.log("Login: Đăng nhập thành công!")


    /*** 3. Get File ***/


    let fileToGet = 'https://www.fshare.vn/file/CLM5K5R2SIXT?token=1695045223';
    await page.goto(fileToGet, {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0

    })
    await page.waitForSelector('#form-download')
    await new Promise(r => setTimeout(r, 5000));
    let formData = await page.evaluate(() => {
        var downloadForm = $('#form-download');
        return downloadForm.serialize()
    });

    let sendLinkDownload = await page.evaluate(formData => { // Pass formData as an argument
        // Simulate an AJAX request using the fetch API or XMLHttpRequest
        return fetch('https://www.fshare.vn/download/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: formData,
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    }, formData); // Pass formData as an argument to the page.evaluate() function


    // let sendLinkDownload = await axios.post('https://www.fshare.vn/download/get', formData, { headers })
    console.log(sendLinkDownload);

    /*** 4. Click Logout ***/
    await page.goto('https://www.fshare.vn/account/security')
    await page.waitForSelector('#form-manage-loginSession > button')
    await new Promise(r => setTimeout(r, 5000));
    await page.click('#form-manage-loginSession > button')
    console.log("Logout: Đã click Logout")
    await new Promise(r => setTimeout(r, 8000));



    /*** 5. Go To Email and Catch Session Close ***/
    await page.goto('https://m.gmail.com/')
    await page.waitForSelector('#subj0')
    await page.click('#subj0')
    await new Promise(r => setTimeout(r, 4000));
    let emailCount = await page.evaluate(() => {
        return document.querySelectorAll('.email.collapsed').length
    });

    if (emailCount > 0) // Có collapsed
    {
        let viewMoreButton = emailCount + 1;
        await page.click('#miu' + viewMoreButton)
    }

    console.log("Email: Đã vào được trang chính")
    await page.waitForSelector('#body > a')
    let sessionRefresh = await page.evaluate(() => {
        return document.querySelector('#body > a').href
    });


    await page.goto(sessionRefresh)
    await page.waitForSelector('.user__profile')
    await new Promise(r => setTimeout(r, 5000));
    console.log("Logout: Logout thành công")



    await browser.close();
    console.log("Kết thúc phiên")

})();