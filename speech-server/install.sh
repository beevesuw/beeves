#! /bin/bash

# Requires curl and jq to be installed


url=$( curl --silent "https://api.github.com/repos/Picovoice/Porcupine/releases/latest" | jq -r '.tarball_url');
archiveName=$(basename $url);
printf 'Downloading %s\n' "$archiveName";
curl -OL $url;
mkdir -p Porcupine
printf 'Extracting %s\n' "$archiveName";

tar  -C ./Porcupine --strip-components=1 -xzvf $archiveName
printf 'Deleting %s\n' "$archiveName";
rm -rf $archiveName;
printf 'Deleted %s\n' "$archiveName";
printf 'Done!'
