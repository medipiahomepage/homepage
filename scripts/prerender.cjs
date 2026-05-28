const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const DIST_DIR = path.join(__dirname, '../dist');

// SPA 라우팅 지원 (모든 요청을 index.html로)
app.use(express.static(DIST_DIR));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// 사전 렌더링할 라우트 목록
const routes = [
  '/',
  '/medical/staff',
  '/brand',
  '/postpartum',
  '/community',
  '/consultation',
  '/international-women'
];

async function prerender() {
  console.log('서버 시작 중...');
  const server = app.listen(PORT, async () => {
    console.log(`포트 ${PORT}에서 로컬 서버 실행 중`);
    try {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      for (const route of routes) {
        const url = `http://localhost:${PORT}${route}`;
        console.log(`사전 렌더링 중: ${route}`);
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // 추가 대기 시간 (React 컴포넌트 렌더링 및 Helmet 태그 주입 확인)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const html = await page.content();
        
        // 저장할 경로 생성
        const filePath = route === '/' 
          ? path.join(DIST_DIR, 'index.html') 
          : path.join(DIST_DIR, route, 'index.html');
          
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ 저장 완료: ${filePath}`);
      }

      await browser.close();
      server.close();
      console.log('🎉 모든 사전 렌더링 완료!');
    } catch (err) {
      console.error('사전 렌더링 중 오류 발생:', err);
      server.close();
      process.exit(1);
    }
  });
}

prerender();
