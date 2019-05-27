var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require(path.resolve('util/dbConnection'));
var sql = require(path.resolve('config/sql.config'));
var jwt = require('jsonwebtoken');  //用来生成token

router.post('/register', function (req, res, next) {
  var params = req.body;
  connection.query(sql.selectAccount, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    } else {
      //判断是否已注册
      for (const account of result) {
        if (params.username == account.username) {
          res.json({ code: -1, msg: '此账号已注册' });
          return;
        }
      }

      //往数据库插入要注册的账号
      addParams = Object.values(params)//提取对象的所有值组成一个数组
      connection.query(sql.insertAccount, addParams, function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          return;
        } else {
          res.json({ code: 0, msg: '注册成功' });
        }
      })
    }
  })
});
router.post('/login', function (req, res, next) {
  var params = req.body;
  connection.query(sql.selectAccount, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    } else {
      for (const account of result) {
        if (params.username == account.username && params.password == account.password) {//判断账号密码是否匹配

          const userName = params.username;
          const token = jwt.sign(params, "jwt", { expiresIn: 60 * 60 });//jwt生成token，1小时后失效
          const expires = new Date().getTime() + 60 * 60;

          const addParams = [userName, token, expires];

          //加入登录信息表
          connection.query(sql.insertAccountLogin, addParams, function (err, result) {
            if (err) {
              console.log('[INSERT ERROR] - ', err.message)
              return
            } else {
              res.json({
                code: 0, msg: '登录成功', token: token, userName: userName
              });
            }
          })
          return;
        }
      }
      res.json({ code: -1, msg: '账号或密码错误' });
    }
  })
});

module.exports = router;