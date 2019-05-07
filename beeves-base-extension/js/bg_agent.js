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

function tabChanged(activeInfo) {
  console.log(activeInfo);
  var sending = browser.tabs.sendMessage(
    activeInfo.tabId,                
    'you are the new tab'
  )
}

browser.tabs.onActivated.addListener(tabChanged);