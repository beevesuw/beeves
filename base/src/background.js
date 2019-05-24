/**
 * handles initialization for beeves compatible webextensions
 * stores extension metadata (beeves.json) when the extension is loaded
 * @todo train the NLU backend for the current extension
 */

import * as BeevesUtils from "./BeevesUtils.js";
import BeevesNativeRouter from "./BeevesNativeRouter.js";

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
      BeevesUtils.dispatch({ text: asrMessage.transcription });
      return asrMessage;
    }, // handle speech
    sys: x => {
      return x;
    } // handle other kind of message
  }
);

/**
 * @description clears beeves metadata when beeves-base is loaded
 */
browser.runtime.onInstalled.addListener(function() {
  let clearStorage = browser.storage.local.clear();
  browser.runtime.onMessage.addListener(BeevesUtils.dispatch);
});

/**
 * @description metadata storage handler, maintains objects corresponding to
 * beeves.json files and hotword-extension mapping
 */
browser.runtime.onMessageExternal.addListener(async function(message, sender) {
  updateBeevesMetadata(message, sender);
  await BeevesUtils.timeout(1000);
  await trainNLUBackend(sender);
});

export async function trainNLUBackend(sender) {
  let snipsfile = (await getBeevesMetadata(sender.id))["snips"];
  let res = await putData(
    `http://localhost:8337/skill/${sender.id}`,
    snipsfile
  );
}

/**
 * @description metadata storage handler, maintains objects corresponding to
 * beeves.json files and hotword-extension mapping
 * @todo REFACTOR
 */
