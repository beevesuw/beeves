import json
import sr
from beeves_asr_listener import AsrListener

import soundfile as sf

asr = AsrListener()

print("Adjusting")
# asr.adjust()
print("Done")

print("Press to rec: ")
input()
result = asr.recognize()
print(json.dumps(result))
