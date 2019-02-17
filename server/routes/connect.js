//引入mysql
const mysql = require('mysql');

//链接的数据库
const connection = mysql.createConnection({
    host :'localhost',
    user :'root',
    password :'root',
    database :'smms'
});

//执行链接方法
connection.connect(()=>{
    console.log('连接数据库成功');
    
})

//暴露对象
module.exports = connection;