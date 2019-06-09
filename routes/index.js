var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');
const {UserModel,ChatModel} = require('../db/models');
const filter = {password: 0, __v: 0};// 查询时的过滤器(过滤掉password和__v属性)


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

/*
测试: 定义注册的路由
路由回调函编程:
1. 获取请求参数数据: req.query/param.body
2. 处理数据: 有可能需要操作数据库
3. 返回响应: res.send()/json()
 */
/*router.post('/register', function (req, res) {
  // 1. 获取请求参数数据: req.query/param.body
  const {username, password} = req.body
  // 2. 处理数据: 有可能需要操作数据库
  if(username==='admin') {
    // 3. 返回响应(失败)
    res.send({code: 1, msg: '此用户已存在, 请重新注册222!'})
  } else {
    // 3. 返回响应(成功)
    res.json({code: 0, data: {_id: 'abc123', username}})
  }

})*/

/*
定义注册的路由
 */
router.post('/register', function (req, res) {

  // 1. 获取请求参数数据
  const {username, password, type} = req.body;
  if (!username||!password||!type){
    res.send({
      code: 100,
      msg: "请输入有效数据"
    });
    return;
  }
  // 2. 处理数据:
  // 1). 根据username查询users集合得到user
  UserModel.findOne({username}, function (error, userDoc) {
    if (error) {
      res.send({
        code: 100,
        msg: "请输入有效数据"
      });
    } else {
      // 2). 如果有, 用户已存在, 注册失败, 返回失败的响应
      if (userDoc) {
        res.send({
          "code": 2,
          "msg": "此用户已存在"
        })
        // 3). 如果没有, 可以注册, 保存用户信息, 成功后返回成功的响应
      } else {
        new UserModel({username, password: md5(password), type}).save((error, userDoc) => {
          if (error) {
            res.send({
              code: 3,
              msg: "请输入有效数据"
            });
          } else {
            // 取出生成的_id
            const _id = userDoc._id;

            // 将用户的id保存到cookie中
            res.cookie('userid', _id, {maxAge: 1000*60*60*24*7}) ;//指定maxAge持久化cookie

            // 返回数据(不能带password)
            res.send({
              code: 0,
              data: {
                _id,
                username,
                type
              }
            })
          }
        })
      }
    }
  })

  // 3. 返回响应: res.send()/json()
});

/*
定义登陆的路由
 */
router.post('/login', function (req, res) {
  const {username, password} = req.body;
  // 根据username和password查询users集合
  UserModel.findOne({username, password: md5(password)}, filter,function (error, userDoc) {
    // 如果没有, 说明登陆不能成功, 返回一个失败的响应
    if (!userDoc) {
      res.send({
        "code": 1,
        "msg": "用户名或密码错误"
      })
    } else {
      // 如果有, 向cookie中保存userid, 返回一个成功的响应
      res.cookie('userid', userDoc._id, {maxAge: 1000*60*60*24*7}) ;//指定maxAge持久化cookie
      res.send({
        code: 0,
        data: {username:userDoc.username,type:userDoc.type}
      })
    }
  })
});

// 更新用户路由
router.post('/update', function (req, res) {
  // 得到请求cookie的userid，这里存在安全问题，应该有token
  const userid = req.cookies.userid;
  if (!userid) {// 如果没有, 说明没有登陆, 直接返回提示
    return res.send({code: 1, msg: '请先登陆'});
  }

  // 更新数据库中对应的数据
  UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, user) {// user是数据库中原来的数据
    const {_id, username, type} = user;
    // node端 ...不可用
    // const data = {...req.body, _id, username, type}
    // 合并用户信息
    const data = Object.assign(req.body, {_id, username, type});
    // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并, 返回一个合并后的对象
    res.send({code: 0, data})
  })
});

// 根据cookie获取对应的user
router.get('/user', function (req, res) {
    // 取出cookie中的userid
    const userid = req.cookies.userid;
    if(!userid) {
        return res.send({code: 1, msg: '请先登陆'})
    }

    // 查询对应的user
    UserModel.findOne({_id: userid},filter,function (err, user) {
        if(!user) { // cookie中的userid是错误数据
            // 删除浏览器端cookie
            res.clearCookie('userid');

            return res.send({code: 1, msg: '请先登陆'})
        } else {
            //let data = {_id:user._id,username:user.username,type:user.type};
            return res.send({code: 0, data: user})
        }

    })
});


/*
查看用户列表
 */
router.get('/userlist',function(req, res){
  const { type } = req.query;
  UserModel.find({type}, filter, function(err,users){
    return res.json({code:0, data: users})
  })
});


/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid;
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    const users = {}; // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    });
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
});

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from;
  const to = req.cookies.userid;
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc);
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
});

module.exports = router;
