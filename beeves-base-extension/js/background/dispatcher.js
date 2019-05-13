browser.runtime.onMessage.addListener(dispatch);

async function dispatch(message) {
  let extensionID = await hotwordMapper(message['text'].split(' ')[0]); 
  let grokked = await grok(extensionID, message['text'].substr(message['text'].indexOf(" ") + 1));
  let intentName = grokked.parse_result.intent.intentName;
  let functionName = await mapIntent(extensionID, intentName);
  let slotsObj = await getArguments(grokked);
  await new BeevesRPC(extensionID, functionName, slotsObj).execute();
  return Promise.resolve(true);
}

async function mapIntent(extensionID, intentName){
  let metadata = await getBeevesMetadata(extensionID);
  return Promise.resolve(metadata.beeves.functionMap[intentName]);
}

function getArguments(grokked){
  let slots = {};
  grokked.parse_result.slots.forEach(function(slot){
    slots[slot.slotName] = slot.rawValue;
  });
  return slots;
}