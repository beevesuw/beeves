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
export async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
export async function hotwordMapper(hotword) {
  let dict = await browser.storage.local.get(["beeves_hotwords"]);
  return dict.beeves_hotwords[hotword];
}
export async function getBeevesMetadata(extensionID) {
  let beeves_metadata = await browser.storage.local.get(["beeves_metadata"]);
  let extension_metadata = beeves_metadata.beeves_metadata[extensionID];
  return Promise.resolve(extension_metadata);
}
export async function printStorage() {
  browser.storage.local.get(
    ["beeves_metadata", "beeves_hotwords", "clipboard"],
    function(data) {
      console.log(data);
    }
  );
}

export function BeevesRPC(extensionID, functionName, args) {
  this.extensionID = extensionID;
  this.functionName = functionName;
  this.arguments = args;
  this.execute = async function() {
    let sending = await browser.runtime.sendMessage(
      extensionID,
      {
        type: "beevesRPC",
        functionName: functionName,
        arguments: Object.values(args)
      },
      {}
    );
    console.log(sending);
    return sending;
  };
}

export async function dispatch(message) {
  let extensionID = await hotwordMapper(message["text"].split(" ")[0]);
  let grokked = await grok(
    extensionID,
    message["text"].substr(message["text"].indexOf(" ") + 1)
  );
  let intentName = grokked.parse_result.intent.intentName;
  let functionName = await mapIntent(extensionID, intentName);
  let slotsObj = await getArguments(grokked);
  await new BeevesRPC(extensionID, functionName, slotsObj).execute();
  return Promise.resolve(true);
}
export async function mapIntent(extensionID, intentName) {
  let metadata = await getBeevesMetadata(extensionID);
  return Promise.resolve(metadata.beeves.functionMap[intentName]);
}
export async function getArguments(grokked) {
  let slots = {};
  grokked.parse_result.slots.forEach(function(slot) {
    slots[slot.slotName] = slot.rawValue;
  });
  return slots;
}

export async function updateBeevesMetadata(message, sender) {
  browser.storage.local.get("beeves_metadata", function(beeves_metadata) {
    beeves_metadata = beeves_metadata.beeves_metadata || beeves_metadata;
    beeves_metadata[sender.id] = message;
    browser.storage.local.set({ beeves_metadata }, function() {});
  });
  browser.storage.local.get("beeves_hotwords", function(beeves_hotwords) {
    beeves_hotwords = beeves_hotwords.beeves_hotwords || beeves_hotwords;
    beeves_hotwords[message.beeves.hotword] = sender.id;
    browser.storage.local.set({ beeves_hotwords }, function() {
      printStorage();
    });
  });
  return Promise.resolve(true);
}
