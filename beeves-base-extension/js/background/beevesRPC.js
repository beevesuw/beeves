function BeevesRPC(extensionID, functionName, args){
    this.extensionID = extensionID;
    this.functionName = functionName;
    this.arguments = args;
    this.execute = async function(){
        let sending = await browser.runtime.sendMessage(
          extensionID,
          {
            'type':'beevesRPC',
            'functionName':functionName,
            'arguments':Object.values(args)
          },
          {}
        );
        console.log(sending);
        return sending;
      }
}