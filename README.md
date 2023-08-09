# 介绍

该项目基于 Vite 构建而成的前端通用脚手架。

## 代码提交说明

代码提交必须遵循 Commitizen 插件定义的提交规范。代码提交有以下几种方法

1. 全局安装 git-cz `npm install -g git-cz`。执行`git cz`弹出交互式命令行。按照提示提交代码。
2. 使用 `npm run commit` 代替 `git commit`。执行`npm run commit`命令后，弹出交互式命令行。按照提示提交代码。
3. VSCode 商店安装 [Visual Studio Code Commitizen Support](https://link.juejin.cn/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3DKnisterPeter.vscode-commitizen) 插件。command/ctrl + shift + p 输入 conventional commit，弹出菜单。
   或者点击 vscode 左侧源代码管理按钮。点击 conventional commit 按钮弹出菜单。

## 目录结构

```json
├── dist                     # 编译打包后的项目文件
├── public
│   ├── favicon.ico          # Favicon
│   └── index.html           # 项目入口模版文件
├── src
│   ├── assets               # 本地静态资源，存放jpg、png等文件
│   ├── components           # 业务通用组件
│   ├── routes               # 路由配置文件
│   ├── services             # 后台接口服务
│   ├── styles               # 全局样式文件
│   ├── utils                # 工具库
│   ├── views                # 业务页面入口和常用模板
│   └── global.ts            # 全局 ts
├── typings                  # 全局类型定义文件
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── .editorconfig            # 编辑器配置
├── .eslintignore            # eslint检查忽略文件
├── .gitignore               # git忽略文件
├── .prettierignore          # prettier忽略文件
├── .prettierrc.js           # prettierrc代码风格检查配置文件
├── README.md                # 项目说明文档
├── CHANGELOG.md             # 更新说明文档
└── package.json             # 项目编译配置
```

## 依赖说明

```json
├── react                    # 全局类型定义文件
├── react-dom                # 编辑器配置
└── package.json             # 项目编译配置
```

## 版本号规则

新建项目初始版号为 0.1.0
版本格式：主版本号.次版本号.修订号，版本号递增规则如下：

主版本号（major）：当你做了不兼容的 API 修改。

次版本号（minor）：当你做了向下兼容的功能性新增。

修订号（patch）：当你做了向下兼容的问题修正。

先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。
当项目初始上线后修改版本号为 1.0.0

更多语义化版本号规则请阅读：
[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)

## 发布规则

当需要发布上线版本时，需要执行 npm run release，然后根据版本号规则更新版本号。

## Tips

1. 脚手架已引入 dayjs，不需要引入 momentjs 作为日期库
2. 样式文件统一使用 less
3. http 请求库统一使用 axios。同时 services 文件夹内已封装 axios 请求库。建议使用 request
4. import 文件，统一使用@前缀作为路径别名。便于项目维护和重构
5. css 样式文件已引入 tailwind 工具库。通用类样式编写尽量使用 tailwind 内提供的样式类
