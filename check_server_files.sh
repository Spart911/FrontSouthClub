#!/bin/bash

echo "=== Проверка файлов на сервере ==="
echo ""

# Проверяем, существует ли директория
echo "1. Проверка директории:"
ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/ 2>/dev/null || echo "❌ Директория не найдена"

echo ""
echo "2. Проверка конкретного файла:"
if [ -f "/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg" ]; then
    echo "✅ Файл существует"
    ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
else
    echo "❌ Файл не найден"
    echo "Ищем похожие файлы:"
    ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/ | grep c0d0c3a9
fi

echo ""
echo "3. Проверка прав доступа:"
ls -ld /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/ 2>/dev/null || echo "❌ Нет прав на директорию"

echo ""
echo "4. Проверка nginx конфига:"
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "✅ nginx.conf найден"
    grep -n "uploads/products" /etc/nginx/nginx.conf || echo "❌ location /uploads/products/ не найден"
else
    echo "❌ nginx.conf не найден"
fi

echo ""
echo "5. Проверка sites-available:"
if [ -d "/etc/nginx/sites-available" ]; then
    echo "✅ sites-available найден"
    for file in /etc/nginx/sites-available/*; do
        if [ -f "$file" ]; then
            echo "Проверяем $file:"
            grep -n "uploads/products" "$file" || echo "❌ location /uploads/products/ не найден в $file"
        fi
    done
else
    echo "❌ sites-available не найден"
fi

echo ""
echo "6. Проверка статуса nginx:"
systemctl status nginx --no-pager -l

echo ""
echo "7. Проверка логов nginx:"
echo "Последние ошибки:"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "❌ Лог ошибок недоступен"

echo ""
echo "8. Тест прямого доступа:"
curl -I https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg 2>/dev/null || echo "❌ Ошибка при запросе"
