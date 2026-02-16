@echo off
cd /d "%~dp0"
echo Starting Virtual Classroom Backend...
uvicorn app.main:app --reload --reload-dir app --host [IP_ADDRESS] --port 8000
pause
