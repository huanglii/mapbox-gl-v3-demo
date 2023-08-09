module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: ['test', 'feat', 'fix', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'],
  scopes: [],
  types: {
    feat: {
      description: '新特性、新功能',
      emoji: '✨',
      value: 'feat',
    },
    fix: {
      description: '故障修复,处理bug',
      emoji: '🐛',
      value: 'fix',
    },
    refactor: {
      description: '重构代码。不包括 bug 修复、功能新增',
      emoji: '💡',
      value: 'refactor',
    },
    perf: {
      description: '优化代码,提升性能、体验',
      emoji: '⚡️',
      value: 'perf',
    },
    style: {
      description: '不改变代码功能的变动(如删除空格、格式化、去掉末尾分号等).注意不是CSS修改',
      emoji: '💄',
      value: 'style',
    },
    chore: {
      description: '对构建过程或辅助工具和库的更改,不影响源文件、测试用例的其他操作',
      emoji: '🤖',
      value: 'chore',
    },
    docs: {
      description: '文档更新(如:README)',
      emoji: '📝',
      value: 'docs',
    },
    release: {
      description: '创建发布提交',
      emoji: '🏹',
      value: 'release',
    },
    ci: {
      description: '修改了 CI 配置、脚本',
      emoji: '🎡',
      value: 'ci',
    },
    test: {
      description: '添加、修改测试用例',
      emoji: '💍',
      value: 'test',
    },
  },
}
