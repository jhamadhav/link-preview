const https = require("https");
const fs = require("fs");
const path = "./temp.html";

// actual scrape function
const scrap = (url) => {
    return new Promise((resolve, reject) => {
        // request function
        const req = https.request(url, (res) => {
            const writeStream = fs.createWriteStream(path, "utf-8");

            // get status code
            let status = res.statusCode;
            // console.log('statusCode:', status);

            // if status is 200 i.e everything is fine
            if (status >= 200 && status <= 299) {
                // writing the file
                res.pipe(writeStream);

                //once it has been written reading it
                writeStream.on('finish', () => {

                    let res = fs.readFileSync(path, "utf-8");
                    // console.log(readStream);

                    // deleting after we have read the file
                    // fs.unlinkSync(path);

                    resolve(res.toString());

                });
            } else if (status >= 300 && status <= 399) {
                let moved_url = res.headers.location;
                console.log(moved_url);
                resolve(scrap(moved_url));
            } else {
                console.log(status);
                console.log(res.headers);
            }

        });

        req.on('error', (e) => {
            console.error(e);
            reject(e);
        });
        req.end();
    })

}

module.exports = scrap;