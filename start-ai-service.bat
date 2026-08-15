@echo off
setlocal

set "ROOT=%~dp0"
set "PYTHON_EXE=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%PYTHON_EXE%" (
  echo Bundled Python not found at:
  echo %PYTHON_EXE%
  exit /b 1
)

cd /d "%ROOT%ai-service"
echo Starting AI service on http://localhost:8000
"%PYTHON_EXE%" run_api.py

