// global link preview list
let links = {};

// load all the anchor tags and assign them a hover event
let a = document.getElementsByTagName("a");
for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("mouseover", () => {
        get_preview(a[i].href);
    });
}

// for custom button
document.getElementById("search").onclick = () => {
    let a = document.getElementById("inp").value;
    get_preview(a);
};

// send data to the server
const send_data = async (url) => {
    let data = { "url": url };
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    let res = await fetch("/api", options);
    let d = JSON.stringify(await res.json());
    // console.log(d);
    return d;
};

// get preview function
const get_preview = async (url) => {

    // show loading while content loads
    let title = document.getElementById("title");
    title.innerText = "Loading...";

    let description = document.getElementById("description");
    description.innerText = "Almost there";

    let url2 = document.getElementById("url");
    url2.innerText = "Just a sec...!";

    // if it already exists then don't send request to the server
    if (!links.hasOwnProperty(url)) {

        let data = await send_data(url);
        // console.log(data);

        links[url] = JSON.parse(data);
    }

    // call function to make changes in the dom elements
    show_preview(links[url]);
}

// make changes to the link preview tab
const show_preview = async (data) => {

    // wait for the data to come
    let obj = await data;
    // console.log(obj);

    // get the necessary elements
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let image = document.getElementById("image");
    let url = document.getElementById("url");

    // set property only if the data we received is not undefined
    if (obj["title"] !== undefined) {
        title.innerText = obj["title"];
    } else {
        title.innerText = "Title";
    }

    if (obj["description"] !== undefined) {
        description.innerText = obj["description"];
    } else {
        description.innerText = "Description : not found";
    }

    if (obj["image"] !== undefined) {
        image.src = obj["image"];
    } else {
        image.src = "./images/dummy.svg";
    }

    url.innerText = obj["url"];

    // add event listener to the link-preview element so it takes to the url that it shows
    document.getElementById("link-preview").addEventListener("click", () => {
        window.location = obj.url;
    });
}

// function to send mail
const send_mail = () => {
    let msg = document.getElementById("mail_msg").value;
    window.open(`mailto:contact@jhamadhav.com?subject=${msg}`);

}



