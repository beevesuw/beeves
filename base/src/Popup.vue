<template>
  <section class="beevesagent">
    <div class="block">
      <button
        class="button is-medium is-primary"
        @click="isOpen = !isOpen"
        aria-controls="contentIdForA11y2"
      >Toggle</button>
    </div>

    <b-collapse aria-id="contentIdForA11y2" class="beevesagent" :open.sync="isOpen">
      <div slot="trigger" class="panel-heading" role="button" aria-controls="contentIdForA11y2">
        <strong>Title</strong>
      </div>
      <p class="panel-tabs">
        <a>All</a>
        <a>Public</a>
        <a>Private</a>
      </p>
      <beautiful-chat
        :participants="participants"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :icons="icons"
        :open="openChat"
        :showEmoji="true"
        :showTypingIndicator="showTypingIndicator"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :messageStyling="messageStyling"
        @onType="handleOnType"
      />
      <div class="panel-block">
        <AdaptiveCard :card="card"/>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <br>Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus.
        <br>Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.
      </div>
    </b-collapse>
  </section>
</template>

<script>
import Vue from "vue";
import AdaptiveCard from "./AdaptiveCard.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";
import Chat from "vue-beautiful-chat";
import Buefy from "buefy";

Vue.use(Buefy, {
  defaultIconPack: "fa"
});
Vue.use(Chat);

Vue.use(AdaptiveCard);

library.add(faWindowClose);

Vue.component("font-awesome-icon", FontAwesomeIcon);

export default {
  components: {
    AdaptiveCard
  },
  data() {
    return {
      card: {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.0",
        body: [
          {
            type: "TextBlock",
            text: "Publish Adaptive Card schema",
            weight: "bolder",
            size: "medium"
          },
        ],
        actions: [
          {
            type: "Action.Submit",
            "title": "Action.Submit",
            "data": {
              "x": 13
            } 
          }
        ]
      },
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIconSvg,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "user1",
          name: "Matteo",
        },
        {
          id: "user2",
          name: "Support",
          
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      messageList: [
        { type: "text", author: `me`, data: { text: `Say yes!` } },
        { type: "text", author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },

  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "support",
          type: "text",
          data: { text }
        });
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message];
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log("Emit typing event");
    }
  }
};
</script>



<style lang="scss" scoped>
// Import Bulma's core
.beevesagent {
  @import "~@fortawesome/fontawesome-free/css/fontawesome.min.css";
  @import "~bulma/sass/utilities/_all";
  z-index: 999;
  position: fixed;
  top: 2em;
  right: 2em;
  // Set your colors
  $primary: #8c67ef;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099ff;
  $twitter-invert: findColorInvert($twitter);

  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
    "white": (
      $white,
      $black
    ),
    "black": (
      $black,
      $white
    ),
    "light": (
      $light,
      $light-invert
    ),
    "dark": (
      $dark,
      $dark-invert
    ),
    "primary": (
      $primary,
      $primary-invert
    ),
    "info": (
      $info,
      $info-invert
    ),
    "success": (
      $success,
      $success-invert
    ),
    "warning": (
      $warning,
      $warning-invert
    ),
    "danger": (
      $danger,
      $danger-invert
    ),
    "twitter": (
      $twitter,
      $twitter-invert
    )
  );

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
}
</style>