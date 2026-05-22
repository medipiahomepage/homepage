@echo off
chcp 65001 > nul
echo ========================================
echo  메디피아 홈페이지 Firebase 배포
echo ========================================
echo.

cd /d "f:\2026년_외주개발\메디피아_홈페이지\Medipia_Homepage"

echo [1/3] Firebase 로그인 확인...
firebase login
if %ERRORLEVEL% NEQ 0 (
    echo 로그인 실패. 다시 시도합니다...
    firebase login --reauth
)

echo.
echo [2/3] 프로젝트 설정...
firebase use medipiahomepage

echo.
echo [3/3] Firebase Hosting 배포 중...
firebase deploy --only hosting

echo.
echo ========================================
echo  배포 완료!
echo  URL: https://medipiahomepage.web.app
echo ========================================
pause
