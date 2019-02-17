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


  

module.exports = router;