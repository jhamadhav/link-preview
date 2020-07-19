const express = require('express');
const scrapper = require("./scraper");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

//  The body-parser middleware  here
app.use("/", bodyParser.urlencoded({ extended: false }));

// for static files
app.use("/", express.static(__dirname + "/../public"))

// our main webpage
app.get('/', function (req, res) {
    let absolutePath = __dirname + "/../public/index.html";
    res.sendFile(absolutePath);
});

// to listen to
app.listen(port, () => console.log(`Serving at : http://localhost:${port}`));

// handle post request
app.post('/scrape', async (req, res) => {
    // let data = await scrapper(req.query.url);
    console.log(req.query);
    res.json({ "url": "data" });
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

