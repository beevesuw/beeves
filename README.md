# Table of contents
1. [Installation](#installation)
2. [Overview](#overview)
3. [Voice Data Lifecycle?](#voice-data-lifecycle)
3. [Another paragraph](#paragraph2)

## Installation <a name="installation"></a>
Clone this repo
```
git clone https://github.com/beevesuw/beeves
```
Install the speech server dependencies using the install.sh script
```
cd speech-server
./install.sh
cd ..
```
Install base dependencies
```
cd base
npm install 
```
Build using webpack
```
npm run build
```
Run the base extension in Firefox
```
npm run test
```

## Overview <a name="overview"></a>
The Browser ExtEnsion Voice Enhancement System (Beeves) is a framework enabling end-to-end voice development in browser extensions.

## Voice Data Lifecycle <a name="voice-data-lifecycle"></a>
Enabling voice functionality requires implementation of several stages in a pipeline, already managed for you with Beeves. This includes hotword detection, speech-to-text (STT), and natural language understanding (NLU). 

#### Hotword Detection

Voice agents listen for a "hotword" (a.k.a. "wake word") spoken by the user before accepting and interpreting speech. This requires a trained model, already implemented. No further work is required from the extension developer here.

#### Speech-To-Text

An utterance is audio input converted to text. A speech-to-text (STT) service conducts this process using separate models trained on millions of voice samples. The text output from STT has an associated confidence based on model variance.

#### Intent Specification

The input speech as text is processed according to a set of definitions specified as intents. An intent is a type, property, action with parameters, or value. Intents are specified using schema from SNIPS ontology. Beeves accepts intents specified based on SNIPS. Intents may be formatted in YAML.

#### Intent Mapping and Natural Language Understanding

Utterances from STT are mapped to pre-specified intents using separate models trained for natural language understanding (NLU). Parsed intents consist of entities and slots (or parameters). Intent parsing from speech is accomplished by observing its statistical similarity to training input based on co-presence of specific words and context.

Here is an end-to-end example of intent parsing:

##### Utterance

> "What will be the weather in paris at 9pm?"

##### Intent Specification Snippet (this is a stub)

```{
    "entity": "locality",
        {
            "values": [
                {
                    "value": "paris",
                    "value": "london",
                    "value": "cairo"
                }
            ]
        }
```

##### Parsed Intent Output

```{
    "intent": {
        "intentName": "searchWeatherForecast",
        "confidenceScore": 0.95
    },
    "slots": [
        {
            "value": "paris",
            "entity": "locality",
            "slotName": "forecast_locality"
        },
        {
            "value": {
                "kind": "InstantTime",
                "value": "2018-02-08 20:00:00 +00:00"
            },
            "entity": "snips/datetime",
            "slotName": "forecast_start_datetime"
        }
    ]
}
```

## Intent File Formatting <a name="paragraph2"></a>
Intent files ingested by Beeves must be specified using the SNIPS JSON format

## Using Beeves from a webextension
Define a Beeves action handler object: function names correspond to intents specified in the Beeves file
```
let beevesActionHandler = {
  newTab: (room, color) => {
    const creating = browser.tabs.create({
      url: "https://example.org"
    });
    console.log("creating new tab!");
    response = beevesConnector.createResponse(0, 'confirmation');
    return response;
  }
};
```


