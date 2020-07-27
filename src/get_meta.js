// parser
const cheerio = require('cheerio');
let $;

const meta_info = (doc, url0) => {
    // use html parser to get meta tags value
    $ = cheerio.load(doc);

    // values for the meta tags
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || undefined;

    // limiting the length 
    if (title.length > 70) {
        title = title.substring(0, 70) + "...";
    }
    title = title.trim();


    let description = $('meta[property="og:description"]').attr('content') || get_from("p") || get_from("div") || undefined;

    // limiting the length 
    if (description.length > 200) {
        description = description.substring(0, 200) + "...";
    }
    description = description.trim();

    let image = $('meta[property="og:image"]').attr('content') || $('link[re="icon"]').attr('href') || $('img').first().attr('src') || undefined;
    // some conditions for the image url
    if (image != undefined) {
        let res = new RegExp("^(https://){1}");
        if (!res.test(image)) {
            image = url0 + image;
        }
    }

    // constructing the actual json to send
    let msec_in_7days = 1000 * 60 * 60 * 24 * 7;
    let data = {
        "time": Date.now() + msec_in_7days,
        "title": title,
        "description": description,
        "image": image,
        "url": url0
    };
    return data;
}

// get data from p tags
const get_from = (tag = "p") => {
    let res = undefined;
    for (let i = 1; i < 5; i++) {
        res = $(`${tag}:nth-of-type(${i})`).text();
        res = res.trim();
        if (res !== undefined && res.length > 1) {
            return res;
        }
    }
    return undefined;
}

module.exports = meta_info;