@echo off
cd /d "%~dp0"
call npm ci && call npm run dev
pause
