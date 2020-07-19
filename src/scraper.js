const https = require("https");

// actual scrape function
const scrap = (url) => {
    return new Promise((resolve, reject) => {
        // request function
        const req = https.request(url, (res) => {

            // get status code
            let status = res.statusCode;
            // console.log('statusCode:', status);

            // if status is 200 i.e everything is fine
            if (status >= 200 && status <= 299) {

                data = "";
                res.on("data", chunk => {
                    data += chunk;
                })
                res.on("end", () => {
                    resolve(data);
                })

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