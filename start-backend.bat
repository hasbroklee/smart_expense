@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_DIR=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=C:\Users\hasbr\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"

if not exist "%NODE_DIR%\node.exe" (
  echo Bundled Node.js not found at:
  echo %NODE_DIR%\node.exe
  exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"
cd /d "%ROOT%backend"

if not exist "node_modules" (
  echo Installing backend dependencies...
  call "%PNPM_CMD%" install || exit /b 1
)

echo Starting backend on http://localhost:3000
"%NODE_DIR%\node.exe" server.js

