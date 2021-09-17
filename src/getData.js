// get title
const getTitle = async page => {
    let title = await page.evaluate(() => {

        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle != null && ogTitle.content.length > 0) {
            return ogTitle.content;
        }

        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle != null && twitterTitle.content.length > 0) {
            return twitterTitle.content;
        }

        let docTitle = document.title;
        if (docTitle != null && docTitle.length > 0) {
            return docTitle;
        }

        let h1 = document.querySelector("h1").innerHTML;
        if (h1 != null && h1.length > 0) {
            return h1;
        }

        let h2 = document.querySelector("h1").innerHTML;
        if (h2 != null && h2.length > 0) {
            return h2;
        }
        return "undefined";
    });

    // limiting the length if found
    if (title != null && title.length > 70) {
        title = title.substring(0, 70) + "...";
    }
    if (title != null) {

        title = title.trim();
    }

    return title;
};

// get description
const getDescription = async page => {
    let description = await page.evaluate(() => {
        let ogDescription = document.querySelector(
            'meta[property="og:description"]'
        );
        if (ogDescription != null && ogDescription.content.length > 0) {
            return ogDescription.content;
        }

        let twitterDescription = document.querySelector(
            'meta[name="twitter:description"]'
        );
        if (twitterDescription != null && twitterDescription.content.length > 0) {
            return twitterDescription.content;
        }

        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription != null && metaDescription.content.length > 0) {
            return metaDescription.content;
        }

        paragraphs = document.querySelectorAll("p");
        let fstVisibleParagraph = null;
        for (let i = 0; i < paragraphs.length; i++) {
            if (
                // if object is visible in dom
                paragraphs[i].offsetParent !== null &&
                !paragraphs[i].childElementCount != 0
            ) {
                fstVisibleParagraph = paragraphs[i].textContent;
                break;
            }
        }
        return fstVisibleParagraph;
    });

    // limiting the length
    if (description != null && description.length > 200) {
        description = description.substring(0, 200) + "...";
    }
    if (description != null) {

        description = description.trim();
    }

    return description;
};

// get image url
const getImage = async (page, url) => {
    let img = await page.evaluate(async () => {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (
            ogImg != null &&
            ogImg.content.length > 0
        ) {
            return ogImg.content;
        }

        let imgRelLink = document.querySelector('link[rel="image_src"]');
        if (
            imgRelLink != null &&
            imgRelLink.href.length > 0 &&
            (await urlImageIsAccessible(imgRelLink.href))
        ) {
            return imgRelLink.href;
        }

        let twitterImg = document.querySelector('meta[name="twitter:image"]');
        if (
            twitterImg != null &&
            twitterImg.content.length > 0 &&
            (await urlImageIsAccessible(twitterImg.content))
        ) {
            return twitterImg.content;
        }

        let imgs = document.getElementsByTagName("img")[0];
        if (imgs) {
            return imgs.src;
        }
        return null;
    });

    // some conditions for the image url
    if (img != undefined) {
        let res = new RegExp("^(https://){1}");
        if (!res.test(img)) {
            if (img[0] == '.') {
                img = img.substring(1)
            }
            image = url + img;
        }
    }
    return img;
};

module.exports = { getTitle, getDescription, getImage };