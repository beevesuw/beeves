import { grok } from "./BeevesNLUtils.js";
import {getBeevesMetadata} from "./BeevesMetadataUtils.js";

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

async function hotwordMapper(hotword) {
  let dict = await browser.storage.local.get(["beeves_hotwords"]);
  return dict.beeves_hotwords[hotword];
}

function BeevesRPC(extensionID, functionName, args) {
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

async function mapIntent(extensionID, intentName) {
  let metadata = await getBeevesMetadata(extensionID);
  return Promise.resolve(metadata.beeves.functionMap[intentName]);
}

async function getArguments(grokked) {
  let slots = {};
  grokked.parse_result.slots.forEach(function(slot) {
    slots[slot.slotName] = slot.rawValue;
  });
  return slots;
}