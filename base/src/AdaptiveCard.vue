<template>
  <div></div>
</template>

<script>
import * as AdaptiveCards from "adaptivecards";

export default {
  components: {
    AdaptiveCards
  },
  props: ["card"],
  mounted() {
    this._card = new AdaptiveCards.AdaptiveCard();
    this._card.parse(this.card);
    console.dir(this._card)
    this._card.onExecuteAction =  (action) => {console.log("action", action) };
    this._cardElement = this._card.render();
    console.log(this._cardElement)
    this.$el.appendChild(this._cardElement);
  }
};
</script>
