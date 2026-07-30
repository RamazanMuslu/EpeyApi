import os
import re
import sys
import warnings

warnings.filterwarnings("ignore")

def local_search(query):
    query_slug = query.lower().replace(" ", "-").replace("_", "-")
    examples_dir = os.path.join(os.path.dirname(__file__), "epey-examples")
    if os.path.exists(examples_dir):
        for fname in os.listdir(examples_dir):
            if fname.endswith(".html"):
                base = fname[:-5].lower()
                if query_slug in base or base in query_slug:
                    return fname
    return None

def online_search(query):
    try:
        from ddgs import DDGS
    except ImportError:
        try:
            from duckduckgo_search import DDGS
        except ImportError:
            return None

    clean_query = query.replace("-", " ").replace("+", " ").strip()
    target_query = f'site:epey.com "{clean_query}"'
    
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(target_query, max_results=15))

        for res in results:
            href = res.get("href", "")

            if "epey.com" in href and ".html" in href:
                lower_href = href.lower()
                if "/kat/" in lower_href or "/ara/" in lower_href:
                    continue

                match = re.search(r"([^/]+\.html)$", href)
                if match:
                    return match.group(1)
        return None
    except Exception:
        return None

def search_epey(query):
    # Try local examples first
    local_match = local_search(query)
    if local_match:
        return local_match
    
    # Try online DDG search
    return online_search(query)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query_text = sys.argv[1]
        found_id = search_epey(query_text)
        if found_id:
            print(found_id)
        else:
            print("BULUNAMADI")
    else:
        print("BULUNAMADI")
