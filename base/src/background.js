import { dispatch } from "./BeevesDispatcher.js";
import { updateBeevesMetadata } from "./BeevesMetadataUtils.js";
import { trainNLUBackend } from "./BeevesNLUtils.js";
import BeevesNativeRouter from "./BeevesNativeRouter.js";

/**
 * @description clears beeves metadata when beeves-base is loaded
 */
browser.runtime.onInstalled.addListener(function() {
  let clearStorage = browser.storage.local.clear();
});

export const beevesNativeRouterInstance = new BeevesNativeRouter(
  "beeves_speech_server",
  {
    hotword: x => {
      console.log("HANDLING HOT");
      return x;
    }, // handle hot
    asr: asrMessage => {
      console.log("HANDLING ASR");
      console.log(asrMessage);
      dispatch({ text: asrMessage.transcription });
      return asrMessage;
    }, // handle speech
    sys: x => {
      return x;
    } // handle other kind of message
  }
);

browser.runtime.onMessageExternal.addListener(async function(message, sender) {
  updateBeevesMetadata(message, sender);
  await timeout(1000);
  await trainNLUBackend(sender);
});

export async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}