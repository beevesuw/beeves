let agentDiv = document.createElement("div");
agentDiv.style.cssText = `position:fixed;bottom:100px;right:100px;z-index:999;`;
agentDiv.setAttribute("id", "agent");
agentDiv.innerHTML = `{{ message }}`;
document.body.appendChild(agentDiv);

let agentVue = new Vue({
    el: '#agent',
    data: {
      message: 'none'
    }
})

messageHandler = async function(message, sender, sendResponse){
    alert(message);
    agentVue.message = message;
    return Promise.resolve(true);
}

browser.runtime.onMessage.addListener(messageHandler);