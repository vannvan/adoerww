## TODO

[] 先获取到知识库，存储slug username id,交互式选择需要导出到知识库
[] 根据上一步获取到的id，再获取某个知识库下的文档列表 <https://www.yuque.com/api/docs?book_id=XXXX>
[] 以上接口拿到的是扁平数据，获取 slug

## apis

登录 <https://www.yuque.com/api/accounts/login>

获取知识库列表 <https://www.yuque.com/api/mine/book_stacks>

获取某个知识库下的文档 <https://www.yuque.com/api/docs?book_id=XXXX>

导出 <https://www.yuque.com/xxxxxx/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false>

xxxxxx 代表  用户名/知识库/文档
