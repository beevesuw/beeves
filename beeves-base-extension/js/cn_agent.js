// let agentDiv = document.createElement("div");
// agentDiv.style.cssText = `position:fixed;bottom:100px;right:100px;z-index:999;`;
// agentDiv.setAttribute("id", "agent");
// agentDiv.innerHTML = `{{ state }}`;
// document.body.appendChild(agentDiv);

// let agentVue = new Vue({
//     el: '#agent',
//     data: {
//       state: 'none'
//     }
// })

// messageHandler = async function(agent, sender, sendResponse){
//     agentVue.state = agent.state;
//     return Promise.resolve(true);
// }

// browser.runtime.onMessage.addListener(messageHandler);