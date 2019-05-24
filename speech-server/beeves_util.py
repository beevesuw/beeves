import json
import struct
import sys
from datetime import datetime

from collections import Mapping

import logging


def send_native_message(message_content, writer=sys.stdout.buffer, max_len=1024 * 1024, flush=True,
                        add_timestamp=True):  # 1 MiB
    if not writer.writable():
        raise BytesWarning(f"Writer not writable")
    if add_timestamp is True and (isinstance(message_content, Mapping) or isinstance(message_content, dict)):
        message_content = {**message_content}  # noqa
        message_content['timestamp'] = str(datetime.now())
    encoded = json.dumps(message_content).encode('utf-8')
    if len(encoded) > max_len or len(encoded) < 1:
        raise BytesWarning(
            f"Native message length is faulty. Max is {max_len} but this is {len(encoded)} bytes")
    encoded_len_packed = struct.pack('@I', len(encoded))

    logging.debug(f"About to write {encoded}")
    writer.write(encoded_len_packed)
    writer.write(encoded)
    if flush:
        writer.flush()


def recv_native_message(reader=sys.stdin.buffer, max_len=4294967296):  # 4 GiB
    raw_len = reader.read(4)
    if len(raw_len) < 1:
        raise BytesWarning("Bad native message length field")
    message_length = struct.unpack("@I", raw_len)[0]
    if message_length > max_len:
        raise BytesWarning(
            f"Native message length too long. Max is {max_len} but this is {raw_len} bytes")
    message = sys.stdin.buffer.read(message_length).decode("utf-8")
    return json.loads(message)
