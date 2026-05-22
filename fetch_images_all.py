import urllib.request
import json
from bs4 import BeautifulSoup

urls = [
    'http://www.mymedipia.com/103', # 질염
    'http://www.mymedipia.com/47',  # 갱년기
    'http://www.mymedipia.com/110', # 채용신체검사
    'http://www.mymedipia.com/40',  # 내과종합검진
    'http://www.mymedipia.com/84',  # 소화기
    'http://www.mymedipia.com/85',  # 내과초음파
    'http://www.mymedipia.com/34',  # 부인과
    'http://www.mymedipia.com/108', # 자궁근종
]

result = {}
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src and ('upload' in src or 'thumbnail' in src) and not 'logo' in src.lower() and not 'btn' in src.lower():
                if src.startswith('/'):
                    src = 'http://www.mymedipia.com' + src
                images.append(src)
        result[url] = images
    except:
        pass

print(json.dumps(result, indent=2, ensure_ascii=False))
