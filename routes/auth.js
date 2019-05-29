var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var dbConfig = require(path.resolve('config/db.config'));
var { selectAccount, insertAccount } = require(path.resolve('config/sql.config'));

var pool = mysql.createPool(dbConfig.mysql);

router.post('/register', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
    }
    let { username, password } = req.body;
    connection.query(selectAccount, [username], function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
      } else {
        // console.log(result)
        if (result.length > 0) {
          res.json({ code: -1, msg: '此账号已注册' });
        } else {

          //往数据库插入要注册的账号
          connection.query(insertAccount, [username, password], function (err, result) {
            if (err) {
              console.log('[INSERT ERROR] - ', err.message);
            } else {
              res.json({ code: 0, msg: '注册成功' });
            }
          })

        }
      }
    })
    connection.release();
  })
});

router.post('/login', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
    }
    let { username, password } = req.body;
    connection.query(selectAccount, [username], function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
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
    connection.release();
  })
});

module.exports = router;