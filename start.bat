@echo off
chcp 65001 >nul
cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel%==0 (
  set PY=python
) else (
  where py >nul 2>&1
  if %errorlevel%==0 (
    set PY=py
  ) else (
    echo Python не найден. Установите Python 3 и отметьте "Add python.exe to PATH".
    pause
    exit /b 1
  )
)

echo Прототип Е-Паслуга: http://127.0.0.1:4173/
echo Окно не закрывайте, пока смотрите сайт. Чтобы остановить — Ctrl+C.
start "" "http://127.0.0.1:4173/"
%PY% -m http.server 4173 --bind 127.0.0.1
pause
