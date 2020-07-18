const https = require("https");
const fs = require("fs");
const path = "./index.html";

// parser
const cheerio = require('cheerio');
const writeStream = fs.createWriteStream(path, "utf-8");
let data = {
    time: Date.now()
};

// actual scrape function
const scrap = (url) => {
    return new Promise((resolve, reject) => {
        // request function
        const req = https.request(url, (res) => {
            // get status code
            console.log('statusCode:', res.statusCode);

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
                data.url = $('meta[property="og:url"]').attr('content') || "No title available";

                // deleting after we have read the file
                // fs.unlinkSync(path);

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