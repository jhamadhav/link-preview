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

// to show our wepage
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

// api point to send the url 
app.post("/api", async (req, res) => {
    let url = req.body.url;
    // console.log(url);

    // check if url is correct
    if (url) {

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
        res.json({ response: "Internal Error" });
    }

});

// listen for requests :)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

