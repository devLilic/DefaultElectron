# vite-react-electron

[![awesome-vite](https://awesome.re/mentioned-badge.svg)](https://github.com/vitejs/awesome-vite)
![GitHub stars](https://img.shields.io/github/stars/caoxiemeihao/vite-react-electron?color=fa6470)
![GitHub issues](https://img.shields.io/github/issues/caoxiemeihao/vite-react-electron?color=d8b22d)
![GitHub license](https://img.shields.io/github/license/caoxiemeihao/vite-react-electron)

[English](README.md) | 简体中文

## 概述

📦 开箱即用  
🎯 基于官方的 [template-react-ts](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts), 低侵入性  
🌱 结构清晰，可塑性强  
💪 通过类型化的 preload API 访问主进程功能<br>
🖥 很容易实现多窗口  

## 快速开始

使用 [`.node-version`](./.node-version) 中指定的 Node.js 24 LTS。

```sh
# clone the project
git clone https://github.com/devLilic/DefaultElectron.git

# enter the project directory
cd DefaultElectron

# install dependency
npm run init:starter
npm ci

# develop
npm run dev
```

## 调试

![electron-vite-react-debug.gif](/electron-vite-react-debug.gif)

## 目录

*🚨 默认情况下, `electron` 文件夹下的文件将会被构建到 `dist-electron`*

```tree
├── electron                                 Electron 源码文件夹
│   ├── main                                 Main-process 源码
│   └── preload                              Preload-scripts 源码
│
├── release                                  构建后生成程序目录
│   └── {version}
│       ├── {os}-{os_arch}                   未打包的程序(绿色运行版)
│       └── {app_name}_{version}.{ext}       应用安装文件
│
├── public                                   同 Vite 模板的 public
└── src                                      渲染进程源码、React代码
```

## 🔧 额外的功能

1. Electron 自动更新 👉 [阅读文档](docs/RELEASES.md)
2. Playwright 测试

## 🍵 🍰 🍣 🍟

<img width="270" src="https://github.com/caoxiemeihao/blog/blob/main/assets/$qrcode/$.png?raw=true">
