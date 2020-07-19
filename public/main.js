// global link preview list
let links = {
    // "https://google.com/": {
    //     "time": "1222",
    //     "title": "Google",
    //     "description": "search what you want.",
    //     "image": "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    //     "url": "https://google.com"
    // }
}
let a = document.getElementsByTagName("a");
for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("mouseover", () => {
        get_preview(a[i].href);
        a[i].style.color = "wheat";
    });
    a[i].addEventListener("mouseout", () => {
        a[i].style.color = "turquoise";
    })
}
document.getElementById("search").onclick = () => {
    let a = document.getElementById("inp").value;
    get_preview(a);
};
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

const get_preview = async (url) => {
    if (!links.hasOwnProperty(url)) {
        let data = await send_data(url);
        // console.log(data);
        links[url] = JSON.parse(data);
    }
    show_preview(links[url]);
}

const show_preview = async (data) => {
    let obj = await data;
    console.log(obj);
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let image = document.getElementById("image");
    let url = document.getElementById("url");

    // set property
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
        image.src = "./images/dummy.png";
    }

    url.innerText = obj["url"];

    document.getElementById("link-preview").addEventListener("click", () => {
        window.location = obj.url;
    });
}



