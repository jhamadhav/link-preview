const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const scraper = require("./scraper");
const get_meta = require("./get_meta");

// port infos
const port = process.envPORT || 3000;

app.use("/", bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());


app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

app.post("/api", async (req, res) => {
    let url = req.body.url;
    console.log(url);
    if (url) {
        let doc = await scraper(url);
        let data = get_meta(doc, url);
        console.log(data);
        res.json(data);
    } else {
        res.json({ response: "Internal Error" });
    }

});

// listen for requests :)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
