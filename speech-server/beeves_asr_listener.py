#! /usr/bin/env python

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
import sr
import soundfile as sf

import io
import numpy  # Make sure NumPy is loaded before it is used in the callback

assert numpy  # avoid "imported but unused" message (W0611)


class AsrListener(object):
    """
    Demo class for wake word detection (aka Porcupine) library. It creates an input audio stream from a microphone,
    monitors it, and upon detecting the specified wake word(s) prints the detection time and index of wake word on
    console. It optionally saves the recorded audio into a file for further review.
    """

    def __init__(self, recognizer=None, microphone=None):
        if recognizer:
            self.recognizer = recognizer
        else:
            self.recognizer = sr.Recognizer()
        if microphone:
            self.microphone = microphone
        else:
            self.microphone = sr.Microphone(
                sr.Microphone.list_microphone_names().index('pulse'), 16000)
        self.adjust()

    def adjust(self):
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)

    def recognize(self, timeout=6):
        with self.microphone as source:
            'starting listen'
            audio = self.recognizer.listen(source, timeout=timeout)
            response = {
                "ns": 'asr',
                "success": True,
                "error": None,
                "transcription": None
            }
            try:

                # response["transcription"] = recognizer.recognize_speaktome(audio)
                # audio.get_wav
                # response["transcription"] = recognizer.recognize_azure(
                # audio, key = "428f1eb50a494da0b49a56c938500444", location = "westus2")
                result = self.recognizer.recognize_speaktome(audio)
                logging.info(str(result))
                if result:
                    response["transcription"] = result['data'][0].get(
                        'text', None)
                    response["confidence"] = result['data'][0].get(
                        "confidence", None)

            except sr.RequestError:
                # API was unreachable or unresponsive
                response["success"] = False
                response["error"] = "API unavailable"
            except sr.UnknownValueError:
                # speech was unintelligible
                response["error"] = "Unable to recognize speech"
            return response
