const https = require("https");
const scrapper = require("./scraper");

let url = "https://stackoverflow.com/questions/23326561/get-title-of-a-page-with-cheerio";

let a = scrapper(url);
console.log(a);


