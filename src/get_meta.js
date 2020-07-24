// parser
const cheerio = require('cheerio');

const meta_info = (doc, url0) => {
    // use html parser to get meta tags value
    let $ = cheerio.load(doc);

    // values for the meta tags
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || undefined;

    // limiting the length 
    if (title.length > 70) {
        title = title.substring(0, 70) + "...";
    } title.trim();


    let description = $('meta[property="og:description"]').attr('content') || $('p').first().text() || undefined;

    // limiting the length 
    if (description.length > 200) {
        description = description.substring(0, 200) + "...";
    } description.trim();

    let image = $('meta[property="og:image"]').attr('content') || $('link[re="icon"]').attr('href') || $('img').first().attr('src') || undefined;
    // some conditions for the image url
    if (image != undefined) {
        let res = new RegExp("^(https://){1}");
        if (!res.test(image)) {
            image = url0 + image;
        }
    }

    // constructing the actual json to send
    let msec_in_7days = 7 * 24 * 60 * 60 * 1000;
    let data = {
        "time": Date.now() + msec_in_7days,
        "title": title,
        "description": description,
        "image": image,
        "url": url0
    };
    return data;
}

module.exports = meta_info;