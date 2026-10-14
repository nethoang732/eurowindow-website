@echo off
cd /d "%~dp0"
start "Eurowindow preview server" /min cmd /c "node preview-server.cjs"
timeout /t 2 /nobreak >nul
start "" http://localhost:4173
