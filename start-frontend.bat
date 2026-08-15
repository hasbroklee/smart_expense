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
cd /d "%ROOT%frontend"

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call "%PNPM_CMD%" install || exit /b 1
)

echo Ensuring esbuild postinstall is applied...
call "%PNPM_CMD%" approve-builds --all >nul 2>nul
call "%PNPM_CMD%" rebuild esbuild >nul 2>nul

echo Starting frontend on http://localhost:5173/index.html
call "%PNPM_CMD%" dev --host 127.0.0.1 --port 5173

