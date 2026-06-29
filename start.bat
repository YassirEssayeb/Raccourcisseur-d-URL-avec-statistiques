@echo off
start "Backend" cmd /k "cd /d "%~dp0backend" && node server.js"
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npx vite --host"
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
