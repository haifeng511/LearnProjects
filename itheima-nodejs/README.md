## 黑马教程的node.js小项目
### 项目介绍
主要内容是使用node.js进行后台的开发
功能：
**用户注册**
需要填写用户名和密码，后台需要判断用户名是否存在，将密码进行加密处理
**用户登录**
需填写用户名和密码，后台需校验用户和密码是否正确，结果需要返回token
**修改用户的信息**
需要身份认证，token信息不能过期，需发送表单数据
**修改用户的密码**
需要身份认证，token信息不能过期，需发送id、旧密码、新密码，需要旧密码正确

### 项目依赖
初始化项目：
npm init -y
为了避免麻烦，使用原项目统一的依赖包版本
需要安装的依赖：

```
npm i express@4.17.1    服务器
npm i cors@2.8.5        跨域
npm i mysql@2.18.1      数据库
npm i bcryptjs@2.4.3    加密
npm i express-jwt@5.3.3     解析Token
npm i @escook/express-joi   表单数据验证
npm i joi                   表单项规则定义
npm i @hapi/joi@17.1.0      表单项规则定义  这个程序包已经被弃用 改为 npm i joi
```

### 参考链接

http://www.escook.cn:8088/#/

