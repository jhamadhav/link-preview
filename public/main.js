
const get_data = async () => {
    let ur = document.getElementById("url");
    let res = await fetch("scrape", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: ur.value
        })
    });
    let data = await res.text();
    console.log(data);

    document.getElementById("output").innerText = data;
}
