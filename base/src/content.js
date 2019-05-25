import Popup from "./Popup.vue";
import Vue from "vue";

document.body.style.border = "5px solid red";
let agentDiv = document.createElement("nav");
agentDiv.setAttribute("id", "agent");
//agentDiv.innerHTML = `{{ state }}`;

document.body.prepend(agentDiv);
//m.render(document.body, "hello world");

new Vue({
  el: "#agent",
  render: createElement => createElement(Popup)
});
