@echo off
cd /d "%~dp0"
start "Eurowindow preview server" /min cmd /c "npm run dev -- --hostname 127.0.0.1 --port 4173"
timeout /t 2 /nobreak >nul
start "" http://localhost:4173
