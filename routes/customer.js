var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require(path.resolve('util/dbConnection'));
var sql = require(path.resolve('config/sql.config'));
var jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        //验证token
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                switch (err.name) {
                    case 'JsonWebTokenError':
                        res.status(403).send({ code: -1, msg: '无效的token，请重新登录' });
                        break;
                    case 'TokenExpiredError':
                        res.status(403).send({ code: -1, msg: 'token过期，请重新登录' });
                        break;
                }
            } else {
                req.username = decoded.username
            }
        })
    }

    next()
})

router.post('/all', function (req, res, next) {
    let username = req.username
    connection.query(sql.selectAccount, [username], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // console.log(result)
            let acc_id = result[0].acc_id
            connection.query(sql.selectCustomer, [acc_id], function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                } else {
                    // console.log(result)
                    res.send({ code: 0, msg: '返回用户列表成功', data: result })
                }
            })
        }
    })
})

router.post('/add', function (req, res, next) {
    let username = req.username
    let { name, phone, address, remarks } = req.body
    connection.query(sql.selectAccount, [username], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // console.log(result)
            let acc_id = result[0].acc_id
            connection.query(sql.insertCustomer, [name, phone, address, remarks, acc_id], function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                } else {
                    // console.log(result)
                    res.send({ code: 0, msg: '添加用户成功' })
                }
            })
        }
    })
})

router.post('/search', function (req, res, next) {
    let username = req.username
    let { value } = req.body
    if (value) {
        connection.query(sql.selectAccount, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
                // console.log(result)
                let acc_id = result[0].acc_id
                connection.query(sql.searchCustomer, [value, acc_id], function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    } else {
                        // console.log(result)
                        res.send({ code: 0, msg: '搜索成功', data: result })
                    }
                })
            }
        })
    }
})

module.exports = router;