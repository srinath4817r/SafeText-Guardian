"""Offline rules: collect evidence (links and phrases). Rules never give the final verdict."""
import re
from urllib.parse import urlparse

SHORTENERS = {"bit.ly", "tinyurl.com", "cutt.ly", "rb.gy", "t.co", "is.gd", "goo.gl", "ow.ly", "tiny.cc"}
RISKY_TLDS = {"xyz", "top", "click", "link", "info", "biz", "loan", "win", "online", "site",
              "club", "vip", "live", "icu", "cc", "work", "support", "tk", "ml", "ga", "cf", "gq"}
TWO_LEVEL = {"co.in", "gov.in", "org.in", "net.in", "ac.in", "co.uk"}
BRANDS = {
    "sbi": {"sbi.co.in", "onlinesbi.sbi", "sbicard.com"},
    "hdfc": {"hdfcbank.com", "hdfc.com"},
    "icici": {"icicibank.com"},
    "axis": {"axisbank.com"},
    "amazon": {"amazon.in", "amazon.com"},
    "flipkart": {"flipkart.com"},
    "paytm": {"paytm.com"},
    "incometax": {"incometax.gov.in"},
}

URL_RE = re.compile(
    r"""(?ix)
    (?:https?://|www\.)[^\s<>"']+
    |
    \b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.
    (?:com|in|net|org|xyz|top|click|link|info|biz|loan|win|online|site|club|vip|live|icu|cc|ly|gl|me|app)
    \b(?:/[^\s<>"']*)?
    """
)


def registered_domain(host):
    parts = host.split(".")
    if len(parts) >= 3 and ".".join(parts[-2:]) in TWO_LEVEL:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def _check_url(raw):
    url = raw if re.match(r"(?i)^https?://", raw) else "http://" + raw
    host = (urlparse(url).hostname or "").lower()
    if not host:
        return None
    reg = registered_domain(host)
    tld = host.rsplit(".", 1)[-1]
    reasons = []
    if re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", host):
        reasons.append("Raw IP address instead of a website name")
    if reg in SHORTENERS:
        reasons.append("URL shortener hides the real destination")
    if tld in RISKY_TLDS:
        reasons.append(f"Risky website ending (.{tld})")
    if "xn--" in host:
        reasons.append("Look-alike (punycode) characters")
    if host.count("-") >= 2:
        reasons.append("Hyphen-heavy website name")
    flat = re.sub(r"[^a-z0-9]", "", host)
    for brand, genuine in BRANDS.items():
        if brand in flat and reg not in genuine:
            reasons.append(f"Pretends to be {brand.upper()} but is not their official website")
            break
    return {"url": raw, "host": host, "reasons": reasons}


def find_links(text):
    links, seen = [], set()
    for m in URL_RE.finditer(text):
        raw = m.group(0).rstrip(".,;:!?)")
        if m.start() > 0 and text[m.start() - 1] == "@":
            continue  # part of an email address
        if raw.lower() in seen:
            continue
        seen.add(raw.lower())
        item = _check_url(raw)
        if item:
            links.append(item)
    return links


PHRASES = {
    "urgency": r"\b(urgent(ly)?|immediately|within \d+ (hours?|minutes?)|act now|last chance|expires? today)\b",
    "account threat": r"\baccount\b.{0,30}\b(blocked|suspended|frozen|deactivated)\b|\bsecurity breach\b|\bwill be (blocked|suspended|frozen|disconnected)\b",
    "KYC threat": r"\bkyc\b.{0,30}\b(update|expired?|pending|verify|blocked|frozen)\b|\b(update|verify|complete)\s+(your\s+)?kyc\b",
    "reward bait": r"\b(you (have )?won|lottery|cash prize|gift voucher|claim (your )?(reward|prize|refund)|congratulations)\b",
    "small-fee demand": r"\b(processing fee|small charge|activation fee|redelivery fee|customs fee)\b",
    "delivery scam": r"\b(parcel|package|delivery|courier)\b.{0,40}\b(failed|held|pending|undelivered|address|fee|charge)\b",
    "OTP/PIN request": r"\b(share|send|tell|provide|give|enter)\b.{0,25}\b(otp|pin|cvv|password)\b",
}
_NEGATION = re.compile(r"(never|do not|don't|dont|not)\s*$")


def find_phrases(text):
    found = []
    for category, pattern in PHRASES.items():
        for m in re.finditer(pattern, text, re.IGNORECASE | re.DOTALL):
            before = text[max(0, m.start() - 12):m.start()].lower()
            if category == "OTP/PIN request" and _NEGATION.search(before):
                continue
            found.append({"category": category, "text": m.group(0)[:80]})
    return found


def check_rules(text):
    text = text or ""
    return {"links": find_links(text), "phrases": find_phrases(text)}
