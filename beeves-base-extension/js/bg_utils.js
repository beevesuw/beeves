/**
 * @description enahnced logging to make debugging easier
 * @todo train the NLU backend for the current extension
*/
function log(message){
    console.log("-----------------------");
    console.log("beeves-base says:");
    console.log(message);
    console.log("-----------------------");
}

async function putData(endpoint, payload) {
  try {
    let res = await fetch(endpoint, {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    res = await res.json();
    //log(res);
    return res;
  }catch(err) {
    console.log(err);
  }
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function grok(extension, query){
  let res = await fetch("http://localhost:8337/grok", {
    body: `{\"q\":\"${extension} ${query}\"}`,
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  res = await res.json();
  return res;
}

/**
 * @param {string} hotword
 * @returns {Promise}
 * @description maps hotword (extension-specific trigger word, eg: 'arithmetic') to extension ID
 * @example
 *    await hotwordMapper('arithmetic')
 *    //-->arithmetic@beeves.com 
 */
async function hotwordMapper(hotword){
  let dict = await browser.storage.local.get(['beeves_hotwords']);
  return dict.beeves_hotwords[hotword];
}

async function getBeevesMetadata(extensionID){
  let beeves_metadata = await browser.storage.local.get(['beeves_metadata']);
  let extension_metadata = beeves_metadata.beeves_metadata[extensionID];
  return Promise.resolve(extension_metadata);
}

/** 
 * @description for testing only, displays metadata in local storage
 */
function printStorage(){
  browser.storage.local.get(['beeves_metadata', 'beeves_hotwords'], function(data){
    //console.log(data);
  });
}