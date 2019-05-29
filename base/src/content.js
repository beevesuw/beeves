import Popup from "./Popup.vue";
import Vue from "vue";

let agentDiv = document.createElement("nav");
agentDiv.setAttribute("id", "agent");
//agentDiv.innerHTML = `{{ state }}`;

document.body.prepend(agentDiv);
//m.render(document.body, "hello world");

new Vue({
  el: "#agent",
  render: createElement => createElement(Popup)
});

browser.runtime.onMessage.addListener(message => {
  alert(JSON.stringify(message));
  return Promise.resolve(true);
});