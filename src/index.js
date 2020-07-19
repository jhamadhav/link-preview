const express = require("express");
const scraper = require("./scraper");
const bodyParser = require("body-parser");
const app = express();

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
    let data = await scraper(url);
    res.json(data);
});

// listen for requests :)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
