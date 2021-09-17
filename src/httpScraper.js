const fetch = require('cross-fetch');
const { getTitle, getDescription, getImage } = require("./getHttpData");

// actual scrape function
const scrap = (url) => {
    let urlInit = url;
    if (url !== undefined) {
        // regex to add https
        let res = new RegExp("^(https://|http://){1}");
        if (!res.test(url)) {
            url = "https://" + url;
        }
    }
    return new Promise(async (resolve, reject) => {
        // request function
        let reqData;
        try {
            reqData = await fetch(url);
        } catch (e) {
            console.log("caught");
            reject(undefined)
            return 0;
        }

        console.log('statusCode:', reqData.status);
        if (reqData.status != 200) {
            console.log("error:");
            let data = {
                title: 'No title',
                description: 'No description available',
                image: 'No image available',
                url: undefined
            }
            resolve(data)
        } else {
            let page = await reqData.text()
            // constructing the actual json to send
            let msec_in_7days = 1000 * 60 * 60 * 24 * 7;
            let data = {
                "time": Date.now() + msec_in_7days,
                "title": getTitle(page),
                "description": getDescription(page),
                "image": getImage(page, url),
                "url": urlInit
            };
            resolve(data);
        }
    })

}

module.exports = scrap;