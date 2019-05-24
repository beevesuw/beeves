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