# beeves-speech-server
The hotword detection and ASR server for Beeves

Extract this file so that you have a directory named `Porcupine/` in the root directory:

`https://github.com/Picovoice/Porcupine/archive/v1.6.tar.gz`

then:

```
python3 -m venv venv
pip3 install -r Porcupine/requirements.txt
pip3 install -r ./requirements.txt
```


Then:


Edit `beeves_speech_server.json` to put the absolute path to `start_beeves_speech_server.sh`:


```
{
  "name": "beeves_speech_server",
  "description": "Example host for native messaging",
  "path": "/home/altan/cap/beeves-speech-server/start_beeves_speech_server.sh",
  "type": "stdio",
  "allowed_extensions": [ "beeves@beeves.dev" ]
}

```

```
cp ./add-on/beeves_speech_server.json $HOME/.mozilla/native-messaging-hosts/beeves_speech_server.json
```

