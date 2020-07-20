// npm modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


// self made modules
const scraper = require("./scraper");
const get_meta = require("./get_meta");
const { create_new, findByUrl } = require("./myDB");

// port infos
const port = process.envPORT || 3000;

// parser
app.use("/", bodyParser.urlencoded({ extended: false }));
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
        let data = await findByUrl(url);

        // if present
        if (data != undefined) {
            // console.log(data);
            res.json(data);
        } else {
            // else scrape the web and feed it into the database
            let doc = await scraper(url);
            let data = get_meta(doc, url);
            // console.log(data);
            create_new(data);
            res.json(data);
        }
    } else {
        //if url is incorrect then send internal error
        // if url entered is wrong then a follow back json
        let err_res = {
            title: "Error : 404",
            description: "URL is incorrect | Try adding https protocol"
        }
        res.json(err_res);
    }

});

// listen for requests :)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// function to check url
const validURL = (str) => {
    var pattern = new RegExp('^(https:\\/\\/){1}' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
