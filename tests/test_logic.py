from guardian.redact import redact_text
from guardian.rules import check_rules


def reasons_of(res):
    return [r.lower() for link in res["links"] for r in link["reasons"]]


def test_otp_is_masked():
    out = redact_text("Your OTP is 123456. Do not share it.")
    assert "123456" not in out and "[OTP REDACTED]" in out


def test_phone_and_account_masked():
    assert "9876543210" not in redact_text("Call me at +91 9876543210")
    assert "9876543210" not in redact_text("Contact 09876543210")
    assert "12345678901234" not in redact_text("Acc No: 12345678901234")


def test_amounts_years_and_links_untouched():
    text = "Rs 5000 debited in 2026. See http://sbi-kyc.xyz/claim/48291"
    assert redact_text(text) == text


def test_shortener_detected_without_scheme():
    assert any("shortener" in r for r in reasons_of(check_rules("Win now bit.ly/win-cash")))


def test_risky_tld_and_brand_lookalike():
    res = check_rules("Update KYC at sbi-rewards.xyz/claim")
    r = reasons_of(res)
    assert any("risky website ending" in x for x in r)
    assert any("pretends to be sbi" in x for x in r)


def test_genuine_domains_not_flagged():
    for msg in ["Track at https://amazon.in/orders", "Visit https://www.hdfcbank.com/login"]:
        assert reasons_of(check_rules(msg)) == []


def test_raw_ip_detected():
    assert any("raw ip" in r for r in reasons_of(check_rules("Open http://192.168.4.7/login now")))


def test_never_share_otp_is_not_a_request():
    res = check_rules("Never share your OTP with anyone")
    assert not any(p["category"] == "OTP/PIN request" for p in res["phrases"])


def test_asking_for_otp_is_flagged():
    res = check_rules("Please share your OTP with the bank executive")
    assert any(p["category"] == "OTP/PIN request" for p in res["phrases"])


def test_kyc_and_urgency_phrases():
    res = check_rules("Your KYC has expired. Update immediately or account will be frozen")
    cats = {p["category"] for p in res["phrases"]}
    assert {"KYC threat", "urgency"} <= cats
