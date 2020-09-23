const puppeteer = require('puppeteer');
// custom 
const { getTitle, getDescription, getImage } = require("./getData");


// main function
const scrap = async (url) => {
    try {
        // add https if it is not undefined
        if (url !== undefined) {
            // regex to add https
            let res = new RegExp("^(https://|http://){1}");
            if (!res.test(url)) {
                url = "https://" + url;
            }
        }

        const browser = await puppeteer.launch();
        const [page] = await browser.pages();

        await page.goto(`${url}`, { waitUntil: 'networkidle0' });

        // constructing the actual json to send
        let msec_in_7days = 1000 * 60 * 60 * 24 * 7;
        let data = {
            "time": Date.now() + msec_in_7days,
            "title": await getTitle(page),
            "description": await getDescription(page),
            "image": await getImage(page, url),
            "url": url
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



