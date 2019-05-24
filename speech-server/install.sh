#! /bin/bash

SCRIPTPATH=$(readlink -f $0)
SCRIPTDIR=$(dirname $SCRIPTPATH)

NM_DEFAULT_FILENAME="beeves_speech_server_default.json"
PORCUPINE_DIR="./Porcupine"
VENV_DIR="venv"

echo $SCRIPTDIR
echo $SCRIPTPATH

pushd $SCRIPTDIR

read -p "Install Porcupine?" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d $PORCUPINE_DIR ]; then
        echo "The directory ${PORCUPINE_DIR} exists."
        read -p "Remove and redownload Porcupine? " -n 1
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            SHOULD_REMOVE_PORCUPINE_DIR=1
        fi
    fi

    url=$(curl --silent "https://api.github.com/repos/Picovoice/Porcupine/releases/latest" | jq -r '.tarball_url')
    archiveName=$(basename $url)
    echo "Downloading ${archiveName} from ${url}"
    curl -OL $url

    if $SHOULD_REMOVE_PORCUPINE_DIR; then
        rm -rfv $PORCUPINE_DIR
        echo "Removed ${PORCUPINE_DIR}"
    fi

    mkdir -pv $PORCUPINE_DIR
    echo "Extracting ${archiveName}"
    tar -C $PORCUPINE_DIR --strip-components=1 -xzvf $archiveName
    echo "Deleting ${archiveName}"
    rm -rf $archiveName
    echo "Deleted ${archiveName}"
else
    echo "Skipping..."
fi

# Install python dependencies:

read -p "Install Python depepndencies? " -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d $VENV_DIR ]; then
        echo "The directory ${VENV_DIR} exists."
        read -p "Remove dir? " -n 1
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rfv $VENV_DIR
            echo "Removed ${VENV_DIR}"
        fi
    fi
    python3 -m venv $VENV_DIR
    source $VENV_DIR/bin/activate
    pip3 install -r requirements.txt
else
    echo "Skipping..."
fi

# Create native messaging manifest with correct absolute path and install

echo 'Creating native messaging host manifest'

NM_FILENAME=$(cat "${NM_DEFAULT_FILENAME}" | jq -r '.name')".json"

cat $NM_DEFAULT_FILENAME | jq -r --arg cwd $(pwd) '.path = $cwd + "/start_beeves_asr.sh"' >$NM_FILENAME

echo 'Installing native messaging host manifest'

mv -v $NM_FILENAME "${HOME}/.mozilla/native-messaging-hosts/${NM_FILENAME}"
echo 'Done!'
