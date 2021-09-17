const https = require("https");
const fs = require("fs");
const path = "./index.html";
const { getTitle, getDescription, getImage } = require("./getData");
// parser
const cheerio = require('cheerio');
const writeStream = fs.createWriteStream(path, "utf-8");
let data = {
    time: Date.now()
};

// actual scrape function
const scrap = (url) => {
    if (url !== undefined) {
        // regex to add https
        let res = new RegExp("^(https://|http://){1}");
        if (!res.test(url)) {
            url = "https://" + url;
        }
    }
    return new Promise((resolve, reject) => {
        // request function
        const req = https.request(url, (res) => {
            // get status code
            console.log('statusCode:', res.statusCode);
            if (res.statusCode != 200) {
                console.log("error");
                let data = {
                    title: 'No title',
                    description: 'No description available',
                    image: 'No image available',
                    url: undefined
                }
                resolve(data)
            }

            // writing the file
            res.pipe(writeStream);

            //once it has been written reading it
            writeStream.on('finish', () => {

                let res = fs.readFileSync(path, "utf-8");
                // console.log(readStream);

                // use html parser to get meta tags value
                let $ = cheerio.load(res.toString());

                data.title = $('meta[property="og:title"]').attr('content') || $('title').text() || "No title available";
                data.description = $('meta[property="og:description"]').attr('content') || "No description available";
                data.image = $('meta[property="og:image"]').attr('content') || "No image available";
                data.url = $('meta[property="og:url"]').attr('content') || url;

                // deleting after we have read the file
                fs.unlinkSync(path);

                resolve(data);

            });

        });

        req.on('error', (e) => {
            console.error(e);
            reject(e);
        });
        req.end();
    })

}

module.exports = scrap;