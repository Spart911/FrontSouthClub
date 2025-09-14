#!/bin/bash

echo "=== Настройка nginx для обслуживания файлов ==="
echo ""

# Проверяем, есть ли location /uploads/products/ в конфиге
echo "1. Проверка текущего конфига nginx:"
if grep -q "location /uploads/products/" /etc/nginx/nginx.conf; then
    echo "✅ location /uploads/products/ уже настроен в nginx.conf"
    grep -A 10 "location /uploads/products/" /etc/nginx/nginx.conf
else
    echo "❌ location /uploads/products/ не найден в nginx.conf"
fi

echo ""
echo "2. Проверка sites-available:"
if [ -d "/etc/nginx/sites-available" ]; then
    for file in /etc/nginx/sites-available/*; do
        if [ -f "$file" ]; then
            echo "Проверяем $file:"
            if grep -q "location /uploads/products/" "$file"; then
                echo "✅ location /uploads/products/ найден в $file"
                grep -A 10 "location /uploads/products/" "$file"
            else
                echo "❌ location /uploads/products/ не найден в $file"
            fi
        fi
    done
else
    echo "❌ sites-available не найден"
fi

echo ""
echo "3. Проверка sites-enabled:"
if [ -d "/etc/nginx/sites-enabled" ]; then
    for file in /etc/nginx/sites-enabled/*; do
        if [ -f "$file" ]; then
            echo "Проверяем $file:"
            if grep -q "location /uploads/products/" "$file"; then
                echo "✅ location /uploads/products/ найден в $file"
                grep -A 10 "location /uploads/products/" "$file"
            else
                echo "❌ location /uploads/products/ не найден в $file"
            fi
        fi
    done
else
    echo "❌ sites-enabled не найден"
fi

echo ""
echo "4. Проверка статуса nginx:"
systemctl status nginx --no-pager -l

echo ""
echo "5. Проверка логов nginx:"
echo "Последние ошибки:"
tail -10 /var/log/nginx/error.log 2>/dev/null || echo "❌ Лог ошибок недоступен"

echo ""
echo "6. Тест прямого доступа:"
curl -I https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg 2>/dev/null || echo "❌ Ошибка при запросе"

echo ""
echo "=== РЕШЕНИЕ ==="
echo "Если location /uploads/products/ не найден, добавьте в nginx конфиг:"
echo ""
echo "location /uploads/products/ {"
echo "    alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;"
echo "    expires 1y;"
echo "    add_header Cache-Control \"public, immutable\";"
echo "    add_header Access-Control-Allow-Origin \"*\";"
echo "    add_header Access-Control-Allow-Methods \"GET, OPTIONS\";"
echo "    add_header Access-Control-Allow-Headers \"Origin, X-Requested-With, Content-Type, Accept\";"
echo "}"
echo ""
echo "Затем выполните:"
echo "sudo nginx -t"
echo "sudo systemctl reload nginx"
