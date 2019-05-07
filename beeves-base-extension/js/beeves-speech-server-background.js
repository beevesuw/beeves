/*
On startup, connect to the "ping_pong" app.
*/

class BeevesNativeRouter {
  constructor(target, mappings, mappingKey = "ns", logMesssages = true) {
    // mappings should be like:
    // {'hotword' : hotword_fn, 'stt' : stt_fn, 'nlu'}
    let beevesBackendPort = browser.runtime.connectNative(target);

    if (!_.isEmpty(beevesBackendPort)) {
      this.port = beevesBackendPort;
      this.logMessages = logMesssages;
      // Set up

      this.port.onMessage.addListener((response) => {
        if (this.logMessages) console.info("Received: " + JSON.stringify(response));
        this.mappings = mappings;
        this.mappingKey = mappingKey;

        if (_.has(response, "mappingKey")) {
          const ns = response[this.mappingKey];
          let fn = this.mapping[ns];
          if (!_.isEmpty(fn)) {
            fn();
          }
        }
      });
    }
  }
}

const beevesNativeRouterInstance = new BeevesNativeRouter("beeves_speech_server", {
  hotword: (x) => {
    return x;
  }, // handle hot
  speech: (x) => {
    return x;
  }, // handle speech
  sys: (x) => {
    return x;
  } // handle other kind of message
});
