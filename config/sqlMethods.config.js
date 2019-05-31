var path = require('path')
var sql = require(path.resolve('config/sql.config'));
var executeQuery = require(path.resolve('util/executeQuery'));

module.exports = {
    //根据账号(username)查询账号id(acc_id)
    getACC_ID(connection, params, callback) {
        executeQuery(connection, sql.selectAccountACC_ID, params, result => {
            callback && callback(result.length == 1 ? result[0].acc_id : null)
        })
    },
    //添加账号
    addAccount(connection, params, callback) {
        executeQuery(connection, sql.insertAccount, params, callback)
    },
    //查询账号信息
    getAccount(connection, params, callback) {
        executeQuery(connection, sql.selectAccount, params, callback)
    },
    //根据账号id(acc_id)查询所有用户
    getAllCustomer(connection, params, callback) {
        executeQuery(connection, sql.selectCustomer, params, callback)
    },
    //根据用户名(name)和账号id(acc_id)查询单个用户
    getCustomer(connection, params, callback) {
        executeQuery(connection, sql.searchCustomer, params, callback)
    },
    //添加用户
    addCustomer(connection, params, callback) {
        executeQuery(connection, sql.insertCustomer, params, callback)
    },
    //删除用户
    delCustomer(connection, params, callback) {
        executeQuery(connection, sql.deleteCustomer, params, callback)
    },
    //修改用户
    editCustomer(connection, params, callback) {
        executeQuery(connection, sql.updateCustomer, params, callback)
    }
}