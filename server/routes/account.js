// 账号管理路由模块
const express = require('express');
const router = express.Router();

//引入连接数据库模块(自定义模块)
const connection = require('./connect')

//设置响应头 解决跨域
router.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    next();
})


//accountadd 添加账号路由

router.post('/accountadd',(req,res)=>{
    //接收前端发来的数据
    let { username, password, usergroup } = req.body;
    // console.log(username,password,usergroup);
    // res.send('1')
    //数据存入数据库
    //构造sql语句
    const sqlStr = `insert into account(username,password,usergroup) values('${username}','${password}','${usergroup}')`;
    console.log(sqlStr);
    
    //执行构造语句
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        //判断受影响的行数大于0就是插入成功
        if(data.affectedRows>0){
            res.send({"error_code":0,"reason":"插入数据成功"});
        }else{
            res.send({"error_code":1,"reason":"插入数据失败"})
        }
    })
});


//显示所有账号列表的路由 /accountlist
router.get('/accountlist',(req,res)=>{
    //构造sql语句查询所有数据并按时间排序
    const sqlStr = 'select * from account order by ctime desc';
    //执行sql语句
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        //查询到的数据发给前端
        res.send(data);
    })
});

//删除账号的请求 

router.get('/accountdel',(req,res)=>{
    //接收id
    let {id} = req.query;

    //构造删除账号的语句
    const sqlStr = `delete from account where id = ${id}`;
    //执行sql语句
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows > 0){
        //如果受影响行数大于一行就是删除成功，返回成功的对象给前端
        res.send({"error_code":0,"reason":"删除账号成功"});
        }else{
            //否则就是删除失败，返回失败的对象给前端
        res.send({"error_code":1,"reason":"删除账号失败"})
        }
    })
})

/* 
  接收修改-数据回填请求： /accountedit
*/
router.get('/accountedit', (req, res) => {
  // 接收id 
  let { id } = req.query;
  // 构造sql
  const sqlStr = `select * from account where id = ${id}`;
  // 执行sql 
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 把查询的数据返回给前端
    res.send(data);
  })
})

/* 
  接收修改-保存修改后数据的请求 /saveeditaccount
*/
router.post('/accounteditsave', (req, res) => {
  // 接收修改后的新数据 和 原来的id
  let { username, usergroup, editId } = req.body;
  // 构造sql
  const sqlStr = `update account set username='${username}', usergroup='${usergroup}' where id=${editId}`;
  // 执行sql
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 受影响行数大于0 就是修改成功
    if (data.affectedRows > 0) {
      // 返回成功的数据对象给前端
      res.send({"error_code": 0, "reason":"修改账号成功"});
    } else {
      // 返回失败的数据对象给前端
      res.send({"error_code": 1, "reason":"修改账号失败"});
    }
  })
})

//  接收批量删除的路由 /batchdelete
router.get('/batchdelete',(req,res)=>{
  //接收前端发送来的id 是一个数组
  let {selectedId}=req.query;
  //构造sql语句
  const sqlStr = `delete from account where id in (${selectedId})`;
  //执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if (err) throw err;
    if(data.affectedRows>0){
      res.send({"error_code": 0, "reason":"批量删除成功"})
    }else{
      res.send({"error_code": 1, "reason":"批量删除失败"})
    }
  })
})


//分页显示账号列表的路由 /accountlistbypage

router.get('/accountlistbypage', (req, res) => {
  // 接收前端参数
  let {pageSize, currentPage} = req.query;
  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1

  // 构造sql语句 （查询所有数据 按照时间排序）
  let sqlStr = `select * from account order by ctime desc`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 计算数据总条数
    let total = data.length;

    // 分页条件 (跳过多少条)
    let n = (currentPage - 1) * pageSize;
    // 拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;

    // 执行sql语句 （查询对应页码的数据）
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      // 把数据返回给前端 数据总条数 total 和 对应页码的数据 data
      res.send({total,data})
    })
  })
})

  

module.exports = router;