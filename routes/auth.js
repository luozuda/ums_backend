var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var poolConnection = require(path.resolve('util/poolConnection'));
var sqlMethods = require(path.resolve('config/sqlMethods.config'));

router.post('/register', function (req, res, next) {
  poolConnection(connection => {
    let { username, password } = req.body;
    sqlMethods.getACC_ID(connection, [username], acc_id => {
      if (acc_id) {
        res.json({ code: -1, msg: '此账号已注册' });
      } else {
        sqlMethods.addAccount(connection, [username, password], () => {
          res.json({ code: 0, msg: '注册成功' });
        })
      }
    })
  })
});

router.post('/login', function (req, res, next) {
  poolConnection(connection => {
    let { username, password } = req.body;
    sqlMethods.getAccount(connection, [username], result => {
      if (result.length == 1) {
        if (password === result[0].password) {
          //jwt生成加密token，username是公文，密钥是“secret”，1小时后过期
          const token = jwt.sign({ username }, "secret", { expiresIn: 60 * 60 * 1 });
          res.json({
            code: 0, msg: '登录成功', token: token, userName: username
          });
        } else {
          res.json({ code: -1, msg: '密码错误' });
        }
      } else {
        res.json({ code: -1, msg: '此账号未注册' });
      }
    })
  })
});

module.exports = router;