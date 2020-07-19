// parser
const cheerio = require('cheerio');

const meta_info = (doc, url0) => {
    // use html parser to get meta tags value
    let $ = cheerio.load(doc);

    // values for the meta tags
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || undefined;

    let description = $('meta[property="og:description"]').attr('content') || undefined;

    let image = $('meta[property="og:image"]').attr('content') || $('link[re="icon"]').attr('href') || undefined;

    let url = $('meta[property="og:url"]').attr('content') || url0;

    // constructing the actual json to send
    let msec_in_7days = 7 * 24 * 60 * 60 * 1000;
    let data = {
        "time": Date.now() + msec_in_7days,
        "title": title,
        "description": description,
        "image": image,
        "url": url
    };
    return data;
}

module.exports = meta_info;