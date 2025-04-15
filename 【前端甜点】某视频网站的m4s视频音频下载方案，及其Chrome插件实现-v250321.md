[TOC]

# 【前端甜点】某视频网站的m4s视频/音频下载方案，及其Chrome插件实现-v250321

## 引言

[Prompt传送门](https://www.doubao.com/chat/2753124001160962)：

> 请帮我写一个Chrome扩展程序。要求如下：
>
> 1. 使用manifest v3，只在 https://www.bilibili.com/ 激活。
> 2. 请生成前端工程，使用React 18和Yarn，组件库用ant-design。
> 3. 为鼠标右键添加一个选项，点击产生一个弹窗。弹窗由两个div组成，分别占据弹窗的左侧和右侧。左侧和右侧div的class名分别为“url-list”和“result”，下文分别用url-list和div.result指代。这两个div的width和height都应一样。url-list是一个列表，每个条目展示一个url，每个条目的右侧都有一个按钮，文案为“获取”。div.result展示一个base64字符串，文本过长则用省略号省略过长部分，并提供一个按钮，文案为“复制”，点击后将字符串复制到剪贴板。
> 4. 监听网络请求，如果某请求的url包含字符串30216.m4s、30232.m4s、30264.m4s、30280.m4s中的一个，则将该url添加到url-list中展示，注意它要添加到url-list的开头，使得最新的请求排在最前面。点击某url右侧“获取”按钮，则向该url发送get请求，将返回体转为blob，进而编码为base64字符串，展示在div.result中。
> 5.  url-list提供分页功能，每页展示10个条目。
>
> 生成的代码有很多问题，比如不是React脚手架生成的、没有package.json等。所以我在后续Chat里指出了：
>
> - 该react项目应使用vite脚手架生成
> - 请提供package.json

