import { getBeevesMetadata } from "./BeevesMetadataUtils.js";

export async function putData(endpoint, payload) {
    try {
      let res = await fetch(endpoint, {
        method: "put",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      res = await res.json();
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  export async function trainNLUBackend(sender) {
    let snipsfile = (await getBeevesMetadata(sender.id))["snips"];
    let res = await putData(
      `http://localhost:8337/skill/${sender.id}`,
      snipsfile
    );
  }  

export async function grok(extension, query) {
    let res = await fetch("http://localhost:8337/grok", {
        body: `{"q":"${extension} ${query}"}`,
        headers: {
        "Content-Type": "application/json"
        },
        method: "POST"
    });
    res = await res.json();
    console.log(res);
    return res;
}