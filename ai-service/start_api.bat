@echo off
REM Start the FastAPI service on Windows
REM Run from ai-service directory

cd /d "%~dp0"
set "PYTHON_EXE=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%PYTHON_EXE%" (
  "%PYTHON_EXE%" run_api.py
) else (
  python run_api.py
)

