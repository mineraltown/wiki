# 矿石镇的攻略百科

这里只有百科的主页面及通用的 css 与 js 文件。  
使用时，需要在主目录下再 clone 以下几个项目。

- [矿石镇的伙伴们](https://github.com/mineraltown/mineraltown)  
  /mineraltown
- [重聚矿石镇](https://github.com/mineraltown/saikai)  
  /saikai
- [精灵驿站](https://github.com/mineraltown/corosute)  
  /corosute
- [风之集市](https://github.com/mineraltown/bazaar)  
  /bazaar
- [双子村](https://github.com/mineraltown/twotowns)  
  /twotowns
- [三个村庄的珍贵朋友](https://github.com/mineraltown/trio)  
  /trio
- [橄榄镇与希望的大地](https://github.com/mineraltown/olive)  
  /olive
- [Welcome！美丽人生](https://github.com/mineraltown/welcome)  
  /welcome

## 启动

不同于之前的版本的双击 `index.html` 开箱即用，本项目现在使用了绝对路径。  
推荐在 `Nginx` `Apache` 等 HTTP 服务器下使用。  
如需临时使用，则推荐使用 `python3 -m http.server 3000`

## 目录介绍

### CSS

```text
wiki.css        子项目的 index.html 文件的样式，适用于电脑端。（801px及以上）
wiki_m.css      子项目的 index.html 文件的样式，适用于手机端（800px及以下）
main.css        本项目的 index.html 文件的样式，适用于电脑端。（801px及以上）
main_m.css      本项目的 index.html 文件的样式，适用于手机端（800px及以下）
navigation.css  子项目的子菜单页面文件样式
iframe.css      子项目的攻略页面文件样式
```

### JS

`axios@0.27.2` 和 `vue@3.2.36` 的原版及精简版文件，虽然实际项目中使用的 unpkg.com 的 CDN 版。  
但是为了纯单机情况下可用，故收录了这两个文件，单机环境下批量替换即可。

## 部署

```sh
git clone git@github.com:mineraltown/wiki.git
git clone git@github.com:mineraltown/wiki-dev.git wiki/app
git clone git@github.com:mineraltown/mineraltown.git wiki/mineraltown
git clone git@github.com:mineraltown/saikai.git wiki/saikai
git clone git@github.com:mineraltown/bazaar.git wiki/bazaar
git clone git@github.com:mineraltown/twotowns.git wiki/twotowns
git clone git@github.com:mineraltown/trio.git wiki/trio
git clone git@github.com:mineraltown/olive.git wiki/olive
git clone git@github.com:mineraltown/welcome.git wiki/welcome
git clone git@github.com:mineraltown/Mineraltown_Plus.git wiki/saikai/Plus
```

## 版权相关

本项目毕竟是游戏攻略，其内容不可避免的使用了部分游戏素材，该部分素材其版权归该游戏开发公司所有。  
其余部分的内容则适用于[WTFPL 开源协议](LICENSE)。