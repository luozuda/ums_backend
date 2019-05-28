var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require(path.resolve('util/dbConnection'));
var { selectAccount, selectCustomer, insertCustomer, searchCustomer, deleteCustomer, updateCustomer } = require(path.resolve('config/sql.config'));
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
    //根据账号搜索账号id
    connection.query(selectAccount, [username], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // console.log(result)
            let acc_id = result[0].acc_id

            //获取所有用户
            connection.query(selectCustomer, [acc_id], function (err, result) {
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
    //根据账号搜索账号id
    connection.query(selectAccount, [username], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // console.log(result)
            let acc_id = result[0].acc_id

            //判断用户是否已存在数据库中
            connection.query(searchCustomer, [name, acc_id], function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                } else {
                    // console.log(result)
                    if (result.length > 0) {
                        res.send({ code: -1, msg: '用户已存在列表中' })
                    } else {
                        //添加用户
                        connection.query(insertCustomer, [name, phone, address, remarks, acc_id], function (err, result) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                return;
                            } else {
                                // console.log(result)
                                res.send({ code: 0, msg: '添加成功' })
                            }
                        })
                    }

                }
            })

        }
    })
})

router.post('/search', function (req, res, next) {
    let username = req.username
    let { value } = req.body
    if (value) {
        //根据账号搜索账号id
        connection.query(selectAccount, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
                // console.log(result)
                let acc_id = result[0].acc_id

                //搜索用户
                connection.query(searchCustomer, [value, acc_id], function (err, result) {
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

router.post('/delete', function (req, res, next) {
    let username = req.username
    let { name } = req.body
    if (name) {
        //根据账号搜索账号id
        connection.query(selectAccount, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
                // console.log(result)
                let acc_id = result[0].acc_id
                //删除用户
                connection.query(deleteCustomer, [name, acc_id], function (err, result) {
                    if (err) {
                        console.log('[DELETE ERROR] - ', err.message);
                        return;
                    } else {
                        // console.log(result)
                        //获取所有用户
                        connection.query(selectCustomer, [acc_id], function (err, result) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                return;
                            } else {
                                // console.log(result)
                                res.send({ code: 0, msg: '删除成功', data: result })
                            }
                        })
                    }
                })
            }
        })
    }
})

router.post('/edit', function (req, res, next) {
    let username = req.username
    let { name, phone, address, remarks } = req.body
    if (name) {
        //根据账号搜索账号id
        connection.query(selectAccount, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
                // console.log(result)
                let acc_id = result[0].acc_id

                // console.log(name, phone, address, remarks)
                //修改用户信息
                connection.query(updateCustomer, [phone, address, remarks, name, acc_id], function (err, result) {
                    if (err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    } else {
                        // console.log(result)
                        //获取所有用户
                        connection.query(selectCustomer, [acc_id], function (err, result) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                return;
                            } else {
                                // console.log(result)
                                res.send({ code: 0, msg: '修改成功', data: result })
                            }
                        })
                    }
                })
            }
        })
    }
})

module.exports = router;