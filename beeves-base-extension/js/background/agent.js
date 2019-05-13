browser.browserAction.onClicked.addListener(function(){
    //browser.runtime.openOptionsPage();
  }
);

// agent = {
//   state: 'created',
//   tabId: null,
//   setTab: function(tabId){
//     this.tabId = tabId;
//   },
//   setState: function(newState){
//     this.state = newState;
//   },
//   update: function(){
//     if(this.tabId!=null){
//       var sending = browser.tabs.sendMessage(
//         this.tabId,
//         {
//           state: this.state
//         }
//       )
//     }
//   }
// }

// function tabActivated(activeInfo) {
//   console.log(activeInfo);
//   agent.setTab(activeInfo.tabId);
//   agent.update();
// }

// function tabCreated(tab) {
//   console.log(tab.id);
//   agent.setTab(tab.id);
//   agent.update();
// }

// browser.tabs.onActivated.addListener(tabActivated);
// browser.tabs.onCreated.addListener(tabCreated);