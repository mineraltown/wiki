# 矿石镇的攻略百科

项目重构，开发基于半动态架构的新版攻略站，命名为「重生」（reborn）

## 架构介绍

因为需要使用 [vercel](https://vercel.com/home) 部署静态网站，本次开发依旧采用不使用后端。  
并尝试采用 `json` 格式声明富文本内容，方便小程序的开发及使用。  
同时也可以解决之前 `<iframe>` 框架带来的问题。  

但也许会有一个后端程序，用于将 Excel 表格的内容导出为 `json` 格式，方便表格内容的编辑和维护。  

本次开发优先考虑手机用户的体验。  
为减轻开发负担，本站不进行黑暗模式（DarkMode）的适配。

### 测试环境

仅适配主流环境下的显示效果，测试环境如下。

- 显示器 `2560×1440` 分辨率
  - 缩放 `100%` `150%`
- 手机 `Xiaomi 15`
- 平板 `iPad Air (2024)`
- 浏览器 `Chrome` `Edge` `Firefox`

如出现任何问题，欢迎提 [issues](https://github.com/mineraltown/wiki/issues)

## 目录介绍

```txt
├── css
├── js
└── static      # 静态文件
    ├── icon    # 图标
    └── image   # 图片
```

## 版权相关

本项目毕竟是游戏攻略，其内容不可避免的使用了部分游戏素材，该部分素材其版权归该游戏开发公司所有。  
其余内容则适用于 [WTFPL](LICENSE) 开源协议。

### 开放源代码许可

- [vue.js](https://github.com/vuejs/core)
- [vue-router](https://github.com/vuejs/router)
- [axios](https://github.com/axios/axios)
- [weui.js](https://github.com/Tencent/weui.js)
