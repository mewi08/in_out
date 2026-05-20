@echo off
title Sistema de Control de Asistencias
color 0A

:menu
cls
echo ====================================
echo SISTEMA DE CONTROL DE ASISTENCIAS
echo ====================================
echo.
echo 1. Iniciar servidor
echo 2. Abrir navegador
echo 3. Salir
echo.
set /p option=Seleccione una opcion: 

if "%option%"=="1" goto start
if "%option%"=="2" goto browser
if "%option%"=="3" goto exit_all

echo Opcion invalida.
pause
goto menu

:start
cls
echo Iniciando servidor...
echo.

start "" cmd /k "pnpm run start"

timeout /t 3 >nul

echo Servidor iniciado.
pause
goto menu

:browser
cls
echo Abriendo navegador...
start http://localhost:3000
pause
goto menu

:exit_all
cls
echo Cerrando sistema...

taskkill /F /IM node.exe >nul 2>&1
echo Sistema cerrado.
timeout /t 5 >nul
exit