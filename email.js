const PuppeteerEmail = require('puppeteer-email')

const client = new PuppeteerEmail('outlook')

const username = 'irionileen3097@hotmail.com';
const password = '6Vrj0r5vvo'; // this will get from taphoammo api endpoint

    (async () => {


        const session = await client.signin({ username, password })
        const emails = await session.getEmails({ query: 'from:github' })
        await session.close()

        console.log(emails)
    })();