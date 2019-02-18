const express = require('express');
const router = express.Router();

// 引入连接数据库的模块
const connection = require('./connect');

// 引入jwt
const jwt = require('jsonwebtoken');
// 定义秘钥
const secretKey = 'itsource';


// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
  // 设置响应头 解决跨域(目前最主流的方式)
  res.header('Access-Control-Allow-Origin', '*');
  next();
})


module.exports = router;