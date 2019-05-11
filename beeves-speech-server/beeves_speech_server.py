#!/usr/bin/env python

import argparse
import glob
import json
import logging
import os
import platform
import struct
import sys
from datetime import datetime
from threading import Thread
from beeves_util import send_native_message, recv_native_message
import subprocess
import sounddevice as sd
import numpy  # Make sure NumPy is loaded before it is used in the callback

assert numpy  # avoid "imported but unused" message (W0611)


sys.path.append(os.path.join(os.path.dirname(__file__), 'Porcupine/binding/python'))

from porcupine import Porcupine  # noqa

logging.basicConfig(level=logging.DEBUG)

def get_keywords_directory(base_dir='./Porcupine/resources/keyword_files'):
    system = platform.system()

    dir_mappings = {
        'Darwin' : 'mac',
        'Linux'  : 'linux',
        'Windows': 'windows'
    }

    return os.path.join(base_dir, dir_mappings[system])


def int_or_str(text):
    """Helper function for argument parsing."""
    try:
        return int(text)
    except ValueError:
        return text



class HotwordServer(Thread):
    """
    Demo class for wake word detection (aka Porcupine) library. It creates an input audio stream from a microphone,
    monitors it, and upon detecting the specified wake word(s) prints the detection time and index of wake word on
    console. It optionally saves the recorded audio into a file for further review.
    """

    def __init__(
            self,
            library_path,
            model_file_path,
            keyword_dir,
            sensitivity=0.5):

        """
        Constructor.

        :param library_path: Absolute path to Porcupine's dynamic library.
        :param model_file_path: Absolute path to the model parameter file.
        :param keyword_dir: Dir to find keywords.
        :param sensitivity: Sensitivity parameter for  wake word. For more information refer to
        'include/pv_porcupine.h'. It uses the
        same sensitivity value for all keywords.
        """

        super(HotwordServer, self).__init__()

        self._library_path = get_library_path()
        self._model_file_path = model_file_path
        self.keyword_dir = keyword_dir
        self._current_keyword = None

        logging.info(f'{self._library_path}, {self._model_file_path}, {self.keyword_dir}')

    @property
    def keywords(self):
        paths = set(glob.glob(os.path.join(self.keyword_dir, '*.ppn'), recursive=True)) - set(
            glob.glob(os.path.join(self.keyword_dir, '*_compressed.ppn'), recursive=True))

        result = dict(zip([os.path.basename(x).replace('.ppn', '').split('_')[0] for x in paths], paths))
        logging.info('Keys: %r' % (repr([x for x in result.keys()])))
        return result

    def run(self, keyword_name='bumblebee', sensitivity=0.5):
        """
         Creates an input audio stream, initializes wake word detection (Porcupine) object, and monitors the audio
         stream for occurrences of the wake word(s). It prints the time of detection for each occurrence and index of
         wake word.
         """

        # print('- %s (sensitivity: %f)' % (keyword_name, sensitivity))

        def sdcallback(indata, frames, time, status):
            if status:
                logging.info(status)
            if (frames) >= porcupine.frame_length:
                pcm = struct.unpack_from("h" * porcupine.frame_length, indata)
                result = porcupine.process(pcm)
                if result:
                    send_native_message({'ns': 'hotword', 'state': 'on'})

                    logging.info('[%s] detected keyword' % str(datetime.now()))



                    #with sd.InputStream(samplerate=args.samplerate, device=args.device, channels=args.channels, callback=sdcallback) as asr_stream:
                    #    logging.info('Delegating to ASR...')
                    #    pass


        porcupine = None
        audio_stream = None
        sample_rate = None
        porcupine = Porcupine(
            library_path=self._library_path,
            model_file_path=self._model_file_path,
            keyword_file_path=self.keywords.get('bumblebee'),
            sensitivity=sensitivity)

        # Make sure the file is opened before recording anything:
        with sd.RawInputStream(channels=1, dtype='int16', samplerate=porcupine.sample_rate,
                               blocksize=porcupine.frame_length, callback=sdcallback) as stream:
            # print(' Pinned / Top repo Pinned / Top repositories sitories #' *  Pinned / Top repositories 80)
            # print('press Ctrl+C to stop the recording')
            # print('#' * 80)
            while True:
                1 == 1

            # delete Porcupine last to avoid segfault in callback.
        if porcupine is not None:
            porcupine.delete()


def get_library_path():
    system = platform.system()
    machine = platform.machine()

    if system == 'Darwin':
        return os.path.join(os.path.dirname(__file__), 'Porcupine/lib/mac/%s/libpv_porcupine.dylib' % machine)
    elif system == 'Linux':
        if machine == 'x86_64' or machine == 'i386':
            return os.path.join(os.path.dirname(__file__), 'Porcupine/lib/linux/%s/libpv_porcupine.so' % machine)
        else:
            raise Exception(
                'cannot autodetect the binary type. Please enter the path to the shared object using --library_path command line argument.')
    elif system == 'Windows':
        if platform.architecture()[0] == '32bit':
            return os.path.join(os.path.dirname(__file__), 'Porcupine\\lib\\windows\\i686\\libpv_porcupine.dll')
        else:
            return os.path.join(os.path.dirname(__file__), 'Porcupine\\lib\\windows\\amd64\\libpv_porcupine.dll')
    raise NotImplementedError('Porcupine is not supported on %s/%s yet!' % (system, machine))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--keyword_dir', help='directory in which to find keyword files', type=str,
                        default=get_keywords_directory())

    parser.add_argument(
        '--library_path',
        help="absolute path to Porcupine's dynamic library",
        type=str, default=get_library_path())

    parser.add_argument(
        '--model_file_path',
        help='absolute path to model parameter file',
        type=str,
        default=os.path.join(os.path.dirname(__file__), 'Porcupine/lib/common/porcupine_params.pv'))

    parser.add_argument('--sensitivity', help='detection sensitivity [0, 1]', default=0.5)

    parser.add_argument(
        '-l', '--list-devices', action='store_true',
        help='show list of audio devices and exit')
    parser.add_argument(
        '-d', '--device', type=int_or_str,
        help='input device (numeric ID or substring)')
    parser.add_argument(
        '-r', '--samplerate', type=int, help='sampling rate')
    parser.add_argument(
        '-c', '--channels', type=int, default=1, help='number of input channels')

    parser.add_argument(
        '-t', '--subtype', type=str, help='sound file subtype (e.g. "PCM_24")')

    args = parser.parse_args()

    HotwordServer(
        library_path=args.library_path,
        model_file_path=args.model_file_path,
        keyword_dir=args.keyword_dir,
        sensitivity=args.sensitivity).run()
