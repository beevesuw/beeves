import _ from "lodash";
export default class BeevesNativeRouter {
  constructor(target, handlers, mappingKey = "ns", logMesssages = true) {
    // handlers should be like:
    // {'hotword' : hotword_fn, 'stt' : stt_fn, 'nlu'}
    let beevesBackendPort = browser.runtime.connectNative(target);

    if (!_.isEmpty(beevesBackendPort)) {
      this.port = beevesBackendPort;
      this.logMessages = logMesssages;
      // Set up

      this.port.onMessage.addListener(message => {
        if (this.logMessages)
          console.info("Received: " + JSON.stringify(message));
        this.handlers = handlers;
        this.mappingKey = mappingKey;

        if (_.has(message, this.mappingKey)) {
          const ns = message[this.mappingKey];
          let fn = _.get(this.handlers, message[this.mappingKey], console.log);
          fn(message);
        }
      });
    }
  }
}
