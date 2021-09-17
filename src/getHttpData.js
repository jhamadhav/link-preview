const htmlParser = require('node-html-parser');

// get title
const getTitle = (page) => {

    // use html parser to get meta tags value
    let document = htmlParser.parse(page)

    let title = (() => {

        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle != null && ogTitle.getAttribute('content').length > 0) {
            return ogTitle.getAttribute('content');
        }

        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle != null && twitterTitle.getAttribute('content').length > 0) {
            return twitterTitle.getAttribute('content');
        }

        let docTitle = document.querySelector('title');
        if (docTitle != null && docTitle.innerText.length > 0) {
            return docTitle.innerText;
        }

        let h1 = document.querySelector("h1");
        if (h1 != null && h1.innerHTML.length > 0) {
            return h1.innerHTML;
        }

        let h2 = document.querySelector("h2");
        if (h2 != null && h2.innerHTML.length > 0) {
            return h2.innerHTML;
        }
        return "undefined";
    })();

    // limiting the length if found
    if (title != null && title.length > 70) {
        title = title.substring(0, 70) + "...";
    }
    title = title.trim();

    return title;
};

// get description
const getDescription = page => {
    let document = htmlParser.parse(page)
    let description = (() => {
        let ogDescription = document.querySelector(
            'meta[property="og:description"]'
        );
        if (ogDescription != null && ogDescription.getAttribute('content').length > 0) {
            return ogDescription.getAttribute('content');
        }

        let twitterDescription = document.querySelector(
            'meta[name="twitter:description"]'
        );
        if (twitterDescription != null && twitterDescription.getAttribute('content').length > 0) {
            return twitterDescription.getAttribute('content');
        }

        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription != null && metaDescription.getAttribute('content').length > 0) {
            return metaDescription.getAttribute('content');
        }

        paragraphs = document.querySelectorAll("p");
        let fstVisibleParagraph = null;
        for (let i = 0; i < paragraphs.length; i++) {
            if (
                // if object is visible in dom
                paragraphs[i].offsetParent !== null &&
                !paragraphs[i].childElementCount != 0
            ) {
                fstVisibleParagraph = paragraphs[i].innerText;
                break;
            }
        }
        return fstVisibleParagraph;
    })();

    // limiting the length
    if (description != null && description.length > 200) {
        description = description.substring(0, 200) + "...";
    }
    description = description.trim();

    return description;
};

// get image url
const getImage = (page, url) => {
    let document = htmlParser.parse(page)
    let img = (() => {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (
            ogImg != null &&
            ogImg.getAttribute('content').length > 0
        ) {
            return ogImg.getAttribute('content');
        }

        let imgRelLink = document.querySelector('link[rel="image_src"]');
        if (
            imgRelLink != null &&
            imgRelLink.getAttribute('href').length > 0) {
            return imgRelLink.getAttribute('href');
        }

        let twitterImg = document.querySelector('meta[name="twitter:image"]');
        if (
            twitterImg != null &&
            twitterImg.getAttribute('content').length > 0
        ) {
            return twitterImg.getAttribute('content');
        }

        let imgs = document.querySelector("img");
        if (imgs) {
            return imgs.getAttribute('src');
        }
        return null;
    })();

    // some conditions for the image url
    if (img != undefined) {
        let res = new RegExp("^(https://|http://){1}");

        if (!res.test(img)) {
            if (img[0] == '.') {
                img = img.substring(1);
            }
            img = url + img;
        }
    }
    return img;
};

module.exports = { getTitle, getDescription, getImage };