@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto missing_node

if not exist "node_modules\next\package.json" (
  echo First run: installing the locked project dependencies...
  call npm.cmd ci
  if errorlevel 1 goto install_failed
)

echo Starting Eurowindow website...
start "Eurowindow preview server" /min cmd /c "npm.cmd run dev -- --hostname 127.0.0.1 --port 4173"

for /L %%i in (1,1,60) do (
  powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:4173/' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200 -and $r.Content.Contains('Eurowindow')) { exit 0 } } catch {}; exit 1" >nul 2>nul
  if not errorlevel 1 goto open_site
  powershell -NoProfile -Command "Start-Sleep -Seconds 1" >nul 2>nul
)

echo The site did not respond on port 4173. Check the minimized server window for errors.
pause
exit /b 1

:open_site
start "" "http://127.0.0.1:4173/"
exit /b 0

:missing_node
echo Node.js is required. Install Node.js 18.17 or newer, then run this file again.
pause
exit /b 1

:install_failed
echo Dependency installation failed. Check the npm error above and run this file again.
pause
exit /b 1
