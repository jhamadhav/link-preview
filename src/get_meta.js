// parser
const cheerio = require('cheerio');
let data = {
    time: Date.now()
};

const meta_info = (doc) => {
    // use html parser to get meta tags value
    let $ = cheerio.load(doc);

    data.title = $('meta[property="og:title"]').attr('content') || $('title').text() || "No title available";
    data.description = $('meta[property="og:description"]').attr('content') || "No description available";
    data.image = $('meta[property="og:image"]').attr('content') || "No image available";
    data.url = $('meta[property="og:url"]').attr('content') || "No title available";

    return data;
}

module.exports = meta_info;