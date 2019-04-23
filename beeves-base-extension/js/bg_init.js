/**
 * handles initialization for beeves compatible webextensions
 * stores extension metadata (beeves.json) when the extension is loaded
 * @todo train the NLU backend for the current extension
*/

/** 
 * @description clears beeves metadata when beeves-base is loaded
 */
browser.runtime.onInstalled.addListener(function(){
  let clearStorage = browser.storage.local.clear();
});

/** 
 * @description metadata storage handler, maintains objects corresponding to 
 * beeves.json files and hotword-extension mapping
 */
browser.runtime.onMessageExternal.addListener(async function(message, sender){
  updateBeevesMetadata(message, sender);
  await timeout(1000);
  await trainNLUBackend(sender);
});

async function trainNLUBackend(sender){
  let snipsfile = (await getBeevesMetadata(sender.id))['snips'];
  let res = await putData(`http://localhost:8337/skill/${sender.id}`, snipsfile);
}

/** 
 * @description metadata storage handler, maintains objects corresponding to 
 * beeves.json files and hotword-extension mapping
 * @todo REFACTOR
 */
async function updateBeevesMetadata(message, sender){
  browser.storage.local.get('beeves_metadata', function(beeves_metadata){
    beeves_metadata = beeves_metadata.beeves_metadata || beeves_metadata;
    beeves_metadata[sender.id] = message;
    browser.storage.local.set({beeves_metadata}, function(){});
  });
  browser.storage.local.get('beeves_hotwords', function(beeves_hotwords){
    beeves_hotwords = beeves_hotwords.beeves_hotwords || beeves_hotwords;
    beeves_hotwords[message.beeves.hotword] = sender.id;
    browser.storage.local.set({beeves_hotwords}, function(){printStorage();});
  });
  return Promise.resolve(true);
}



