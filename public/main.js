const send_data = async () => {
    let url = document.getElementById("url");
    let data = { url: url.value };
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    let res = await fetch("/api", options);

    let d = await res.json();
    document.getElementById("output").innerText = JSON.stringify(d);
};
