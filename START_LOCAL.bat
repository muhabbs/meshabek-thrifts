@echo off
setlocal

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install Node.js LTS from https://nodejs.org, then reopen this terminal and run START_LOCAL.bat again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or is not on PATH.
  echo Reinstall Node.js LTS and make sure npm is selected.
  pause
  exit /b 1
)

if not exist backend\.env (
  copy backend\.env.example backend\.env >nul
  echo Created backend\.env from backend\.env.example
)

if not exist frontend\.env (
  copy frontend\.env.example frontend\.env >nul
  echo Created frontend\.env from frontend\.env.example
)

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 exit /b 1

echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 exit /b 1

echo.
echo Dependencies installed.
echo Open two terminals:
echo   1. cd backend  ^&^& npm run dev
echo   2. cd frontend ^&^& npm run dev
echo.
echo Then open http://localhost:5173
pause
