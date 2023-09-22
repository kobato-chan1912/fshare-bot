/***  
 * Install Puppeter and Anty Dolphin 
 * npm i gologin
 * npm i puppeteer-core
****/


import puppeteer from 'puppeteer-core';
import GoLogin from 'gologin';
const { connect } = puppeteer;


(async () => {
  // Launch the browser and open a new blank page
  const GL = new GoLogin({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTA2YWJjOTM3M2E4MzY1YWFjNmZlZTYiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NTA2YjNlNmMxNTk4MzZlMzZmMGEyOWIifQ.jgnKKf-N2_D5gJ6EZ6Rjb3ffGLRsUR1Vx40tN3bSUxo',
    profile_id: '6506abc9373a8398c3c6ff04',
    tmpdir: '/private/tmp/gologin_34c0f78d54/profiles/6506abc9373a8398c3c6ff04/Default',

  });
  // const { status, wsUrl } = await GL.start();
  const wsUrl = await GL.startLocal();
  let wsUrlStribng = wsUrl.wsUrl
  const browser = await connect({
    browserWSEndpoint: wsUrlStribng,
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  const viewPort = GL.getViewPort();
  await page.setViewport({ width: Math.round(viewPort.width * 0.994), height: Math.round(viewPort.height * 0.92) });
  const session = await page.target().createCDPSession();
  const { windowId } = await session.send('Browser.getWindowForTarget');
  await session.send('Browser.setWindowBounds', { windowId, bounds: viewPort });
  await session.detach();



  /*** 1. Login To The Fshare ***/

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

  /*** 3. Click Logout ***/
  await page.goto('https://www.fshare.vn/account/security')
  await page.waitForSelector('#form-manage-loginSession > button')
  await new Promise(r => setTimeout(r, 5000));
  await page.click('#form-manage-loginSession > button')
  console.log("Logout: Đã click Logout")
  await new Promise(r => setTimeout(r, 8000));
  


  /*** 4. Go To Email and Catch Session Close ***/
  await page.goto('https://m.gmail.com/')
  await page.waitForSelector('#subj0')
  await page.click('#subj0')
  await new Promise(r => setTimeout(r, 7000));
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
  await GL.stopLocal({ posting: false });
  console.log("Kết thúc phiên")

})();