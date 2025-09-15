module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Целевая версия для современных браузеров
        targets: {
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Safari versions',
            'last 2 Edge versions',
            'Chrome >= 80',
            'Firefox >= 78',
            'Safari >= 14',
            'Edge >= 80'
          ]
        },
        // Не добавляем полифиллы для современных браузеров
        useBuiltIns: false,
        // Не транспилируем модули (для tree-shaking)
        modules: false,
        // Включаем только необходимые плагины
        include: [],
        // Исключаем ненужные трансформации
        exclude: [
          'transform-typeof-symbol',
          'transform-unicode-regex',
          'transform-sticky-regex',
          'transform-new-target',
          'transform-modules-umd',
          'transform-modules-systemjs',
          'transform-modules-amd',
          'transform-literals'
        ]
      }
    ],
    [
      '@babel/preset-react',
      {
        // Используем новый JSX transform
        runtime: 'automatic',
        // Оптимизация для production
        development: process.env.NODE_ENV === 'development'
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    // Удаляем неиспользуемые импорты
    [
      'babel-plugin-import',
      {
        libraryName: 'react',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'react'
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'react-dom',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'react-dom'
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'styled-components',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'styled-components'
    ],
    // Оптимизация для production
    ...(process.env.NODE_ENV === 'production' ? [
      // Удаляем console.log в production
      [
        'transform-remove-console',
        {
          exclude: ['error', 'warn']
        }
      ],
      // Удаляем debugger
      'transform-remove-debugger',
      // Оптимизация условных выражений
      'babel-plugin-minify-constant-folding',
      // Удаляем неиспользуемые переменные
      'babel-plugin-minify-dead-code-elimination'
    ] : [])
  ],
  // Настройки для оптимизации
  env: {
    production: {
      plugins: [
        // Дополнительные оптимизации для production
        'babel-plugin-transform-react-remove-prop-types',
        'babel-plugin-transform-react-pure-class-to-function'
      ]
    }
  }
};
