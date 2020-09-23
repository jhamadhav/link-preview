const mongoose = require("mongoose");
const scraper = require("./scraper");
const dotenv = require('dotenv').config({ path: __dirname + "/../.env" });


// console.log(process.env["URL"]);
try {
    mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
} catch (err) {
    console.log(err);
}

// write the schema
var Schema = mongoose.Schema;
let previewSchema = new Schema({
    time: Number,
    title: String,
    description: String,
    image: String,
    url: String
});

// make the link
var Link = mongoose.model("Link", previewSchema);

// create a new entry
const create_new = async (data) => {
    try {
        if (data) {
            let l = new Link(data);

            await l.save((err, data) => {
                if (err) return console.error(err);
                console.log("Successfully added !");
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// find the entry by url
const findByUrl = (url) => {
    return new Promise(async (resolve, reject) => {
        await Link.find({ "url": url }, async (err, urlFound) => {
            if (err) {
                console.log(err);
                reject(null);
            } else {
                // check if data is undefined
                if (urlFound[0] != undefined) {
                    console.log("Found by url");

                    // if found check if it has expired or not
                    // if it has expired then update it
                    if (urlFound[0].time < Date.now()) {
                        let filter = { "url": url };
                        let data = await scraper(url);
                        find_and_update(filter, data);
                    }
                } else {
                    console.log("Couldn\'t find by url");
                }

                // console.log(urlFound[0]);
                resolve(urlFound[0]);

            }
        });
    });
};

// find and update
const find_and_update = async (filter, update) => {
    await Link.findOneAndUpdate(filter, update, { new: true });
    console.log("successfully updated");
}

module.exports = { create_new, findByUrl };
