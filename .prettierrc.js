module.exports = {
  printWidth: 120, // 换行长度，默认80
  // vscode编辑器没有这项，部分配置项，不生效
  overrides: [
    {
      files: '.prettierrc.js',
    },
  ],
  tabWidth: 2, // tab缩进大小,默认为2
  useTabs: false, // 使用tab（制表位）缩进而非空格
  semi: false, // 每行末尾自动添加分号
  singleQuote: true, // 字符串使用单引号
  proseWrap: 'preserve',
  arrowParens: 'always', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号, always：总是有括号
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  endOfLine: 'auto',
  eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
  htmlWhitespaceSensitivity: 'ignore',
  ignorePath: '.prettierignore',
  jsxBracketSameLine: false, // 设置为true时,将多行JSX元素的 > 放在最后一行的末尾，而不是单独放在下一行
  jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
  trailingComma: 'es5', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  // 可多个空行，最多两行空行。【与此项目padding-line-between-statements冲突，所以配置可多个空行】
  'no-multiple-empty-lines': [
    1,
    {
      max: 2,
    },
  ],
}
