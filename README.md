## What does this currently do?

- Loads a Beeves metadata file, a superset of a snips file, on installation
- Maintains extension metadata and hotword dicts in browser.storage.local
- Extremely basic speech to text

## TODO:

- Train the backend when a new beeves compliant extension is registered
- Dispatch commands to the backend and recieve parsed intents with slot data
- Send this to the extension in question, which has implemented response functionality

## Notes on the Beeves metadata file

- contains a snips file describing intents etc.
- contains activation keyword (do we need a global registry mapping activation keywords to beeves enabled extensions to prevent conflicts?)
- for extensions that manipulate the DOM and perform site-specific actions, do we need a list of URIs on which the extension is allowed to perform actions?

## Firefox config for debugging: 
(ONLY ON YOUR DEVELOPMENT INSTANCE OF FIREFOX, DO NOT DO IMPORTANT WORK WITH THESE SETTINGS)

Type about:config in the FireFox address bar 
set security.csp.enable to false
set security.csp.enableStrictDynamic to false
