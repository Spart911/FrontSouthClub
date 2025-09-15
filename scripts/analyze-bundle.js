#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Анализ размера бандла...\n');

// Функция для получения размера файла
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Функция для форматирования размера
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Функция для анализа бандла
function analyzeBundle() {
  const distPath = path.join(__dirname, '../dist');
  const assetsPath = path.join(distPath, 'assets');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Папка dist не найдена. Сначала выполните сборку: npm run build');
    return;
  }
  
  console.log('📊 Анализ файлов в dist/assets:');
  console.log('─'.repeat(50));
  
  let totalSize = 0;
  const files = [];
  
  // Анализируем все файлы в assets
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath);
    
    assetFiles.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const size = getFileSize(filePath);
      totalSize += size;
      
      files.push({
        name: file,
        size: size,
        type: path.extname(file).substring(1)
      });
    });
  }
  
  // Сортируем по размеру
  files.sort((a, b) => b.size - a.size);
  
  // Выводим результаты
  files.forEach(file => {
    const sizeStr = formatSize(file.size);
    const bar = '█'.repeat(Math.floor(file.size / totalSize * 20));
    console.log(`${file.name.padEnd(30)} ${sizeStr.padStart(10)} ${bar}`);
  });
  
  console.log('─'.repeat(50));
  console.log(`Общий размер: ${formatSize(totalSize)}`);
  
  // Анализ по типам файлов
  const byType = {};
  files.forEach(file => {
    if (!byType[file.type]) {
      byType[file.type] = { count: 0, size: 0 };
    }
    byType[file.type].count++;
    byType[file.type].size += file.size;
  });
  
  console.log('\n📈 Анализ по типам файлов:');
  console.log('─'.repeat(30));
  Object.entries(byType).forEach(([type, data]) => {
    console.log(`${type.padEnd(10)} ${data.count.toString().padStart(3)} файлов ${formatSize(data.size).padStart(10)}`);
  });
  
  // Рекомендации по оптимизации
  console.log('\n💡 Рекомендации по оптимизации:');
  console.log('─'.repeat(40));
  
  const jsFiles = files.filter(f => f.type === 'js');
  const cssFiles = files.filter(f => f.type === 'css');
  const imageFiles = files.filter(f => ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(f.type));
  
  if (jsFiles.length > 0) {
    const jsSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(`• JavaScript: ${formatSize(jsSize)} (${jsFiles.length} файлов)`);
    
    if (jsSize > 500000) { // 500KB
      console.log('  ⚠️  JavaScript бандл слишком большой. Рассмотрите:');
      console.log('     - Ленивую загрузку компонентов');
      console.log('     - Разделение кода на чанки');
      console.log('     - Удаление неиспользуемого кода');
    }
  }
  
  if (cssFiles.length > 0) {
    const cssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(`• CSS: ${formatSize(cssSize)} (${cssFiles.length} файлов)`);
    
    if (cssSize > 100000) { // 100KB
      console.log('  ⚠️  CSS бандл большой. Рассмотрите:');
      console.log('     - Удаление неиспользуемых стилей');
      console.log('     - Критический CSS');
      console.log('     - Минификацию');
    }
  }
  
  if (imageFiles.length > 0) {
    const imageSize = imageFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(`• Изображения: ${formatSize(imageSize)} (${imageFiles.length} файлов)`);
    
    if (imageSize > 1000000) { // 1MB
      console.log('  ⚠️  Изображения занимают много места. Рассмотрите:');
      console.log('     - Оптимизацию изображений');
      console.log('     - Использование WebP/AVIF');
      console.log('     - Ленивую загрузку изображений');
    }
  }
  
  // Проверяем наличие stats.html
  const statsPath = path.join(distPath, 'stats.html');
  if (fs.existsSync(statsPath)) {
    console.log('\n📊 Детальный анализ доступен в dist/stats.html');
  }
}

// Запускаем анализ
analyzeBundle();
