
async function Widgit() {

    const config = {
        headers: {
            "ngrok-skip-browser-warning": "false",
        }
    }
    const { data } = await axios.get(`https://e0f0-49-36-80-203.in.ngrok.io/api/widgit/630883b30f772ccae56e30f6`, config)
    const Wid = data;
    const WidgitData = Wid.data
    console.log("Widgit Data", WidgitData);
    document.getElementById('WidgitImage').src = WidgitData.imageUrl
    if (WidgitData.position === "top-left") {

        document.getElementById('WidgitApp').style.top = "0px";
        document.getElementById('WidgitApp').style.left = "0px";
    }
    if (WidgitData.position === "bottom-left") {

        document.getElementById('WidgitApp').style.bottom = "0px";
        document.getElementById('WidgitApp').style.left = "0px";
    }
    if (WidgitData.position === "bottom-right") {

        document.getElementById('WidgitApp').style.bottom = "0px";
        document.getElementById('WidgitApp').style.right = "0px";
    }
    if (WidgitData.position === "top-right") {

        document.getElementById('WidgitApp').style.top = "0px";
        document.getElementById('WidgitApp').style.right = "0px";
    }
}
Widgit();