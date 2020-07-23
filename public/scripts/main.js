// global link preview list
let links = JSON.parse(localStorage.getItem("link_data")) || {};

window.onload = () => {
    // print the data stored
    // console.log(links)

    // show link when hovered
    document.addEventListener("mouseover", (e) => {
        let url = e.target.parentNode.href || e.target.href;
        // console.log(url);
        if (validURL(url)) {
            get_data(url);
        }
    });

    // for custom button
    document.getElementById("search").onclick = () => {
        let a = document.getElementById("inp").value;
        get_data(a);
    };

    document.addEventListener("keypress", (e) => {
        // console.log(e);
        if (e.keyCode == 13) {
            let a = document.getElementById("inp").value;
            get_data(a);
        }

    });
}

// send data to the server
const send_url = async (url) => {
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
const get_data = async (url) => {

    // show loading while content loads
    let title = document.getElementById("title");
    title.innerText = "Loading...";

    let description = document.getElementById("description");
    description.innerText = "Almost there";

    let url2 = document.getElementById("url");
    url2.innerText = "Just a sec...!";

    // if it already exists then don't send request to the server
    let t = new Date().getTime();
    if (!links.hasOwnProperty(url)) {

        let data = await send_url(url);
        // console.log(data);

        links[url] = JSON.parse(data);
    } else if (links[url].time < t) {

        // if time has expired then delete the item
        delete links[url];

        let data = await send_url(url);
        // console.log(data);

        links[url] = JSON.parse(data);
    }

    // irrespective of the action save the new set of array into the local storage
    // Store
    localStorage.setItem("link_data", JSON.stringify(links));

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
    if (obj["url"] !== undefined) {
        document.getElementById("link-preview").addEventListener("click", () => {
            window.location = obj.url;
        });
    } else {
        document.getElementById("link-preview").addEventListener("click", () => {
            window.location = window.location;
        });
    }


}

// function to check url
const validURL = (str) => {
    var pattern = new RegExp('^(https:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

// function to send mail
const send_mail = () => {
    let msg = document.getElementById("mail_msg").value;
    window.open(`mailto:contact@jhamadhav.com?subject=${msg}`);
}



