import urllib.request
from bs4 import BeautifulSoup

urls = {
    'gyn_inflammation': 'http://www.mymedipia.com/103',
    'gyn_menopause': 'http://www.mymedipia.com/47',
    'internal_national_checkup': 'http://www.mymedipia.com/110',
    'internal_digestive': 'http://www.mymedipia.com/84',
    'internal_ultrasound': 'http://www.mymedipia.com/85',
    'gyn_myoma': 'http://www.mymedipia.com/108',
    'gyn_ultrasound': 'http://www.mymedipia.com/34' # Or other related
}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src and ('upload' in src or 'thumbnail' in src) and not 'logo' in src.lower():
                if src.startswith('/'):
                    src = 'http://www.mymedipia.com' + src
                images.append(src)
        print(f"{name}: {images[:3]}") # Print first 3 images found
    except Exception as e:
        print(f"{name}: Error - {e}")
