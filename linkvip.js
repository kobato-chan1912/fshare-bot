import puppeteerBrowser from 'puppeteer';
let email = "kipol19462@cindalle.com";
let password = "mediafire093245@";

(async () => {
    const browser = await puppeteerBrowser.launch({ headless: 'new', userDataDir: 'myUserDataDir1', });
    // const browser = await puppeteerBrowser.launch({headless:false});
    const page = await browser.newPage();
    try {
        



        /*** 1. Login To The Fshare ***/
        await page.goto('https://linksvip.net/get-link.html');

        try {
            await page.waitForSelector('#fusername', { timeout: 5000 })
            console.log("Login: Xuất hiện màn hình đăng nhập")
            await page.focus('#fusername')
            await page.keyboard.type(email, { delay: 100 }); // Types slower, like a user
            await page.focus('#fpassword')
            await page.keyboard.type(password, { delay: 100 }); // Types slower, like a user
            await page.click('#btn_checkAcc')
        } catch (error) {
            console.log("Đã Login rồi!")
        }


        /*** 2. Wait For Login Is Done  ***/

        await page.waitForSelector('.dl_button')
        await new Promise(r => setTimeout(r, 5000));
        console.log("Login: Đăng nhập thành công!")


        /*** 3. Get File ***/


        let stringProcess = process.argv[2];
        let links = stringProcess.split(',')

        for (let i = 0; i < links.length; i++)
        {
            await page.goto('https://linksvip.net/get-link.html');
            let testLink = links[i];
            try {
            
            
                console.log("Đang get " + testLink)
                await page.goto('https://linksvip.net/get-link.html');
                await page.waitForSelector('#inputLinkget')
                await page.$eval('#inputLinkget', (el, testLink) => el.value = testLink, testLink);
                await page.click('#getlink')
                await page.waitForSelector('#filename')
                let fileName = await page.evaluate(() => {
                    return document.querySelector('#filename').innerText
                });

                let linkVIP = await page.evaluate(() => {
                    return document.querySelector('#inputLink').value
                });

                console.log("FileName: " + fileName);
                console.log("LINK VIP: " + linkVIP);

                if (i !== links.length - 1)
                {
                    console.log("Đợi 60s trước File tiếp theo");
                    await new Promise(r => setTimeout(r, 60000));
                }

                

            } catch (error) {
                console.log("Không thể Get: " + testLink);
            }
        }


        




        await browser.close();




    } catch (error) {


        await browser.close();
        console.log("Có lỗi xảy ra khi thực thi!")
    }



})();