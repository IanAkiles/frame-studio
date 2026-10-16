@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js em https://nodejs.org/en/download
  pause
  exit /b 1
)
node doctor.cjs
if errorlevel 1 (
  pause
  exit /b 1
)
echo Abra no navegador o endereco informado abaixo. Mantenha esta janela aberta.
node server.cjs
pause
