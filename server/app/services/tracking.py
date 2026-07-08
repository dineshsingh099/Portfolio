import requests

_geo_cache: dict[str, str] = {}


def parse_device(user_agent: str) -> str:
    ua = (user_agent or "").lower()
    if "ipad" in ua or "tablet" in ua:
        return "Tablet"
    if "mobi" in ua or "android" in ua or "iphone" in ua:
        return "Mobile"
    return "Desktop"


def classify_source(referrer: str) -> str:
    ref = (referrer or "").lower()
    if not ref:
        return "Direct"
    if "google." in ref:
        return "Google Search"
    if "linkedin." in ref:
        return "LinkedIn"
    if "github." in ref:
        return "GitHub"
    if "instagram." in ref:
        return "Instagram"
    if "twitter." in ref or "t.co" in ref or "x.com" in ref:
        return "Twitter"
    return "Other"


def geo_lookup(ip: str) -> tuple[str, str]:
    """Best-effort IP -> (country name, ISO alpha-2 code) lookup. Never raises;
    falls back to ('Unknown', ''). This performs a blocking network call and
    must be run via run_in_threadpool from async routes."""
    if not ip or ip in ("127.0.0.1", "localhost", "unknown", "testclient"):
        return ("Unknown", "")
    if ip in _geo_cache:
        return _geo_cache[ip]
    country, code = "Unknown", ""
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}?fields=status,country,countryCode", timeout=2)
        if resp.ok:
            data = resp.json()
            if data.get("status") == "success":
                country = data.get("country") or "Unknown"
                code = data.get("countryCode") or ""
    except Exception:
        country, code = "Unknown", ""
    _geo_cache[ip] = (country, code)
    return (country, code)
