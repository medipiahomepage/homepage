import urllib.request
import re
from bs4 import BeautifulSoup

url = 'http://www.mymedipia.com'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Try to find links
    links = soup.find_all('a', href=True)
    for link in links:
        print(f"Link: {link.text.strip()} -> {link['href']}")
except Exception as e:
    print("Error:", e)
