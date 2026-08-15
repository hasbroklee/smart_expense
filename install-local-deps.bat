@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_DIR=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
set "PYTHON_EXE=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%NODE_DIR%\node.exe" (
  echo Bundled Node.js not found at:
  echo %NODE_DIR%\node.exe
  exit /b 1
)

if not exist "%PYTHON_EXE%" (
  echo Bundled Python not found at:
  echo %PYTHON_EXE%
  exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"

cd /d "%ROOT%backend"
call "%PNPM_CMD%" install || exit /b 1

cd /d "%ROOT%frontend"
call "%PNPM_CMD%" install || exit /b 1
call "%PNPM_CMD%" approve-builds --all || exit /b 1
call "%PNPM_CMD%" rebuild esbuild || exit /b 1

cd /d "%ROOT%ai-service"
"%PYTHON_EXE%" -m pip install -r requirements.txt || exit /b 1

echo.
echo Local dependencies installed successfully.
echo You can now run:
echo   start-ai-service.bat
echo   start-backend.bat
echo   start-frontend.bat

