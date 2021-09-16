const puppeteer = require('puppeteer');
// custom 
const { getTitle, getDescription, getImage } = require("./getData");


// main function
const scrap = async (url) => {
    let urlInit = url;
    try {
        // add https if it is not undefined
        if (url !== undefined) {
            // regex to add https
            let res = new RegExp("^(https://|http://){1}");
            if (!res.test(url)) {
                url = "https://" + url;
            }
        }
        const chromeOptions = {
            headless: true,
            defaultViewport: null,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: 'node_modules/puppeteer/.local-chromium/win64-800071/chrome-win/chrome.exe'
        };
        const browser = await puppeteer.launch(chromeOptions);
        const [page] = await browser.pages();

        await page.goto(`${url}`, { waitUntil: 'networkidle0', timeout: 0 });

        // constructing the actual json to send
        let msec_in_7days = 1000 * 60 * 60 * 24 * 7;
        let data = {
            "time": Date.now() + msec_in_7days,
            "title": await getTitle(page),
            "description": await getDescription(page),
            "image": await getImage(page, url),
            "url": urlInit
        };
        console.log(data);

        await browser.close();

        // console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}

module.exports = scrap;



