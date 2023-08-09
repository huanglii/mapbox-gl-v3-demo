module.exports = {
  //指定代码的运行环境
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    JSX: true,
  },
  //定义文件继承的子规范
  extends: [
    /**
     * 所有在规则页面被标记为“✔️”的规则将会默认开启
     * @see https://eslint.bootcss.com/docs/rules/
     */
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    /**
     * @see https://typescript-eslint.io/rules/
     */
    'plugin:@typescript-eslint/recommended',
    // prettier插件的核心代码
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser', //定义ESLint的解析器
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
      modules: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    eqeqeq: 'warn', // 要求使用 === 和 !==
    'no-shadow': 'warn', // 禁止变量声明与外层作用域的变量同名
    'new-cap': 'error', // 要求构造函数首字母大写
    'no-lone-blocks': 'warn', // 禁用不必要的嵌套块
    'no-multi-spaces': 'warn', // 禁止使用多个空格
    'no-self-compare': 'warn', // 禁止自身比较
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: ['function', 'export', 'const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['function', 'export', 'const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: ['multiline-const'], next: 'multiline-const' },
    ],
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off',
  },
}
