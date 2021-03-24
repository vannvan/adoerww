### 获取未读消息

> https://seller.shopee.com.my/webchat/api/v1.2/user/sync

需要的参数 token

### 有新消息可拦截的接口

> https://seller.shopee.com.my/webchat/api/v1.2/conversations/1451748750830325495/read

### mac 日志路径

/Users/vannvan/Library/Logs/electron-quick-start/main.log

### 虾皮 cookies 使用注意的点

cookies 中有一项是和服务器 session 强关联的，所以在网站取用 cookies 时切换店铺不能将上一店铺退出，如果退出将代表当前店铺 cookies 失效，就算复制下来也没用

主要用于 login 接口的 cookies 有 SPC_U SPC_EC SPC_SC_UD SPC_SC_TK 四个值

### 在必要的地方打印日志，特别是错误收集，后面要考虑将错误日志上传，

日志路径可 通过 console.log(log.transports.file.file)查看，

### 用户授权信息保存在项目目录 storage.json 下，目前写的是固定的两个店铺信息和 erp 授权信息，后面可根据后段提供的接口进行调整

### 虾皮上传文件

https://seller.shopee.com.my/webchat/api/v1.2/images?_uid=0-341561079&_v=5.1.2&csrf_token=FmEhdIxNEeuYfgS9cD%2BIIg%3D%3D

conversation_id: 1451748750830325495

file: 二进制文件
