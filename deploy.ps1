# 메디피아 홈페이지 Firebase 배포 스크립트
# medopiamy@gmail.com 계정으로 로그인 후 실행

Write-Host "=== 메디피아 홈페이지 배포 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 로그인 상태 확인
Write-Host "[1/4] 로그인 계정 확인..." -ForegroundColor Yellow
firebase login:list

# 2. 프로젝트 확인
Write-Host ""
Write-Host "[2/4] 현재 Firebase 프로젝트 확인..." -ForegroundColor Yellow
firebase use

# 3. 빌드 (이미 완료되어 있지만 최신 확인)
Write-Host ""
Write-Host "[3/4] 프로덕션 빌드 확인..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    Write-Host "  ✅ dist/ 폴더 존재 — 빌드 완료 상태" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ 빌드 필요 — npm run build 실행 중..." -ForegroundColor Red
    npm run build
}

# 4. 배포
Write-Host ""
Write-Host "[4/4] Firebase Hosting 배포 중..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host ""
Write-Host "=== 배포 완료 ===" -ForegroundColor Green
