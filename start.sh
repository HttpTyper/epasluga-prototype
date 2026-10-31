#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 не найден. Установите пакет python3 и запустите снова."
  exit 1
fi

echo "Прототип Е-Паслуга: http://127.0.0.1:4173/"
echo "Это окно не закрывайте, пока смотрите сайт. Остановка — Ctrl+C."

if command -v xdg-open >/dev/null 2>&1; then
  (sleep 0.4 && xdg-open "http://127.0.0.1:4173/") >/dev/null 2>&1 &
fi

exec python3 -m http.server 4173 --bind 127.0.0.1
