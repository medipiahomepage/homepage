import urllib.request
import re

url = 'http://www.mymedipia.com'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = set(re.findall(r'src="([^"]+\.(?:jpg|png|gif))"', html, re.IGNORECASE))
    for img in images:
        print(img)
except Exception as e:
    print("Error:", e)
