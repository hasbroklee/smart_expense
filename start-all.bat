@echo off
setlocal

echo Starting Smart Expense local stack...
echo.

start "Smart Expense AI Service" cmd /k call "%~dp0start-ai-service.bat"
start "Smart Expense Backend" cmd /k call "%~dp0start-backend.bat"
start "Smart Expense Frontend" cmd /k call "%~dp0start-frontend.bat"

echo Open these after services finish booting:
echo - Frontend: http://127.0.0.1:5173/index.html
echo - Backend health: http://127.0.0.1:3000/health
echo - AI docs: http://127.0.0.1:8000/docs
