/*
On startup, connect to the "ping_pong" app.
*/

class BeevesNativeRouter {
  constructor(target, handlers, mappingKey = "ns", logMesssages = true) {
    // handlers should be like:
    // {'hotword' : hotword_fn, 'stt' : stt_fn, 'nlu'}
    let beevesBackendPort = browser.runtime.connectNative(target);

    if (!_.isEmpty(beevesBackendPort)) {
      this.port = beevesBackendPort;
      this.logMessages = logMesssages;
      // Set up

      this.port.onMessage.addListener(response => {
        if (this.logMessages)
          console.info("Received: " + JSON.stringify(response));
        this.handlers = handlers;
        this.mappingKey = mappingKey;

        if (_.has(response, this.mappingKey)) {
          const ns = response[this.mappingKey];
          let fn = _.get(this.handlers, response[this.mappingKey], console.log);
          fn();
        }
      });
    }
  }
}
