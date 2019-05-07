let agentDiv = document.createElement("div");
agentDiv.style.cssText = `position:fixed;bottom:100px;right:100px;z-index:999;`;
agentDiv.setAttribute("id", "agent");
agentDiv.innerHTML = `{{ message }}`;
document.body.appendChild(agentDiv);

var agentVue = new Vue({
    el: '#agent',
    data: {
      message: 'Hello Vue!'
    }
  })