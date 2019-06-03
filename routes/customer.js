var express = require('express');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var poolConnection = require(path.resolve('util/poolConnection'));
var sqlMethods = require(path.resolve('config/sqlMethods.config'));


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
                // console.log(req.username)
            }
        })
    }
    next()
})

router.post('/all', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.getAllCustomer(connection, [acc_id], result => {
                res.send({ code: 0, msg: '返回用户列表成功', data: result })
            })
        });
    })
})

router.post('/add', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        let { name, phone, sex, address, remarks } = req.body
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.getCustomer(connection, [name, acc_id], result => {
                if (result.length > 0) {
                    res.send({ code: -1, msg: '用户已存在列表中' })
                } else {
                    sqlMethods.addCustomer(connection, [name, phone, sex, address, remarks, acc_id], result => {
                        res.send({ code: 0, msg: '添加成功' })
                    })
                }
            })
        })
    })
})

router.post('/search', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        let { value } = req.body
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.getCustomer(connection, [value, acc_id], result => {
                res.send({ code: 0, msg: '搜索成功', data: result })
            })
        })
    })
})

router.post('/delete', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        let { name } = req.body
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.delCustomer(connection, [name, acc_id], result => {
                sqlMethods.getAllCustomer(connection, [acc_id], result => {
                    res.send({ code: 0, msg: '删除成功', data: result })
                })
            })
        })
    })
})

router.post('/edit', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        let { name, phone, sex, address, remarks } = req.body
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.editCustomer(connection, [phone, sex, address, remarks, name, acc_id], result => {
                sqlMethods.getAllCustomer(connection, [acc_id], result => {
                    res.send({ code: 0, msg: '修改成功', data: result })
                })
            })
        })
    })
})

router.post('/number', function (req, res, next) {
    poolConnection(connection => {
        let username = req.username
        sqlMethods.getACC_ID(connection, [username], acc_id => {
            sqlMethods.getNumOfCustomers(connection, [acc_id], result => {
                res.send({ code: 0, msg: '获取用户人数成功', data: result })
            })
        })
    })
})

module.exports = router;