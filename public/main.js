
const get_data = async () => {
    let ur = document.getElementById("url");
    console.log(ur.value);
    let data = { "ur": ur.value };
    fetch('/scrape', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        query: JSON.stringify(data)
    }).then((res) => {
        console.log("this is res", res.json());
    }).catch((err) => {
        console.log(err);
    })

    // document.getElementById("output").innerText = data;
}
