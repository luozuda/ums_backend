var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require(path.resolve('util/dbConnection'));
var sql = require(path.resolve('config/sql.config'));
var jwt = require('jsonwebtoken');

router.post('/register', function (req, res, next) {
  let { username, password } = req.body;
  connection.query(sql.selectAccount, [username], function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    } else {
      // console.log(result)
      if (result.length > 0) {
        res.json({ code: -1, msg: '此账号已注册' });
      } else {

        //往数据库插入要注册的账号
        connection.query(sql.insertAccount, [username, password], function (err, result) {
          if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
          } else {
            res.json({ code: 0, msg: '注册成功' });
          }
        })

      }

    }
  })
});

router.post('/login', function (req, res, next) {
  let { username, password } = req.body;
  connection.query(sql.selectAccount, [username], function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    } else {
      // console.log(result)
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
    }
  })
});

module.exports = router;