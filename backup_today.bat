@echo off
chcp 65001 > nul
:: 오늘 날짜 구하기 (YYYYMMDD 형식)
For /f "tokens=1-3 delims=-/." %%a in ('date /t') do (set mydate=%%a%%b%%c)
set mydate=%mydate: =%
set "zip_name=Medipia_Homepage_%mydate%.zip"

echo ===========================================
echo  메디피아 홈페이지 소스코드 오늘자 백업
echo ===========================================
echo 생성될 파일: %zip_name%
echo 진행 중... (용량이 큰 node_modules, .git 등은 자동으로 제외됩니다)
echo.

:: Windows 기본 내장 tar 명령어를 사용하여 압축 (zip 파일 형식)
tar.exe -a -c -f "..\%zip_name%" --exclude="node_modules" --exclude=".git" --exclude=".firebase" --exclude="dist" --exclude="*.zip" *

echo.
echo ===========================================
echo 백업이 완료되었습니다!
echo 프로젝트 바깥쪽(상위 폴더)에 [%zip_name%] 파일이 안전하게 생성되었습니다.
echo ===========================================
pause
