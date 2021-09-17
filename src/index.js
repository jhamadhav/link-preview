// npm modules
const express = require("express");
const cors = require('cors')
const app = express();


// self made modules
const pupScraper = require("./pupScraper");
const httpScraper = require("./httpScraper");
const { create_new, findByUrl } = require("./myDB");

// port infos
const port = process.env.PORT || 8000;

// parser
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// to show our webpage
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

// api point to send the url 
app.post("/api", async (req, res) => {
    let url = req.body.url;
    // console.log(url);

    // check if url is correct
    if (validURL(url)) {

        // if url us correct find it in the database
        let data = undefined //await findByUrl(url);

        // if present
        if (data != undefined) {
            console.log("found by URL");
            res.json(data);
        } else {
            // else scrape the web and feed it into the database
            let scrapData = null;
            let httpScrapData = await httpScraper(url);
            console.log(httpScrapData);

            if (httpScrapData.url == undefined) {
                scrapData = await pupScraper(url);
            } else {
                scrapData = httpScrapData
            }


            // if scrapping doesn't fail
            if (scrapData !== null) {
                // create_new(scrapData);
                res.json(scrapData);
            } else {
                let err_res = {
                    title: "Error : 404",
                    description: "Couldn't find anything...!",
                    url: undefined
                }
                res.json(err_res);
            }

        }
    } else {
        //if url is incorrect then send internal error
        // if url entered is wrong then a follow back json
        let err_res = {
            title: "Error : 404",
            description: "URL is incorrect | Try adding https protocol",
            url: undefined
        }
        res.json(err_res);
    }

});

// listen for requests :)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// function to check url
const validURL = (str) => {
    var pattern = new RegExp('^(https:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
