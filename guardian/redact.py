"""Mask private numbers before text is sent to the API. Links are never changed."""
import re

_URL = re.compile(r"(?i)(?:https?://|www\.)\S+")
_OTP = re.compile(r"(?i)\b(otp|code|pin|cvv|password)\b([^\d\n]{0,20})(\d{3,8})\b")
_LONG = re.compile(r"(?<!\d)\d{12,19}(?!\d)")
_PHONE = re.compile(r"(?<!\d)(?:\+?91[-\s]?|0)?[6-9]\d{9}(?!\d)")


def _mask(chunk):
    chunk = _OTP.sub(lambda m: f"{m.group(1)}{m.group(2)}[OTP REDACTED]", chunk)
    chunk = _LONG.sub("[NUMBER REDACTED]", chunk)
    return _PHONE.sub("[PHONE REDACTED]", chunk)


def redact_text(text):
    if not text:
        return ""
    out, last = [], 0
    for m in _URL.finditer(text):
        out.append(_mask(text[last:m.start()]))
        out.append(m.group(0))  # never alter links
        last = m.end()
    out.append(_mask(text[last:]))
    return "".join(out)
