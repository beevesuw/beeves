async function sendMessageToTabs(tabs, message) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
        tab.id,
        message
        ).then(response => {
        console.log(response.response);
        })
    }
}

export async function sendResponseToAgent(response){
    let tabs = await browser.tabs.query({
    });
    await sendMessageToTabs(tabs, response);

}