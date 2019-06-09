# 功能说明

注意：这是后端，请去我的主页下载前端

 1.这是一个仿BOSS直聘的项目，一个前后台分离的招聘的 SPA, 包括前端应用和后端应用
 
 2.包括用户注册/登陆, 大神/老板列表, 实时聊天等模块
 
 3.前端: 使用 React 全家桶+ES6+Webpack 等技术
 
 4.后端: 使用 Node + express + mongodb + socketIO 等技术
 
 5.采用模块化、组件化、工程化的模式开发
 
# 项目安装运行

项目分为：``zhipin``和``zhipin-server``前后端两个功能, ``git clone`` 到本地

1. 首先确保正确安装mongodb并启动服务
2. 切换到``zhipin-server``,运行 ``npm install``安装所需依赖包，执行``npm start``启动后端，出现``db connect success``代表启动成功
3. 切换到``zhipin``,运行 ``npm install``安装所需依赖包，执行``npm start``启动前端，会自动打开浏览器运行项目

 
# 学到的知识

这是做的第二个实战项目，与上一个项目相比，对react的使用更加熟练。

## 新学到的知识
    1. 跨域问题
    2. 前后端分离登陆后跨页面问题(原来做PHP用的session)，这个项目用的redux
    3. antd-mobile的首次使用
    4. webpack的配置，尤其是使用less进行antd-mobile默认主题的修改
    5. socket.io的首次使用，它包装的是H5 WebSocket和轮询, 如果是较新的浏览器内部使用WebSocket, 如果浏览器不支持, 那内部就会使用轮询实现实时通信
    6. 使用mongodb，主要是了解与mysql的区别
    
## 巩固旧知识

    1. 熟悉react,react-redux,react-router-dom
    2. 明白hash路由browser路由的区别
    3. 打包上线后遇到的一些问题，比如哈希路由失效，react样式失效


# 视频教程

该项目是尚硅谷教程的实战项目，并且在慕课网也有个类似的(尚硅谷好多实战是参考的慕课网)

教程地址：https://www.bilibili.com/video/av35195130

慕课网教程地址：
```
链接：https://pan.baidu.com/s/1ABVDQStUqqNzfIGqEn7mGQ 
提取码：2qdi 
复制这段内容后打开百度网盘手机App，操作更方便哦
```




