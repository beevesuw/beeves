browser.browserAction.onClicked.addListener(function(){
    var createData = {
      type: "detached_panel",
      url: "agent.html",
      width: 250,
      height: 250
    };
    var let = browser.windows.create(createData);
  }
);

function tabActivated(activeInfo) {
  console.log(activeInfo);
  var sending = browser.tabs.sendMessage(
    activeInfo.tabId,                
    'you have been activated'
  )
}

function tabCreated(tab) {
  console.log(tab.id);
  var sending = browser.tabs.sendMessage(
    tab.id,
    'you have been created'
  )
}

browser.tabs.onActivated.addListener(tabActivated);
browser.tabs.onCreated.addListener(tabCreated);