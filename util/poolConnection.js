var path = require('path');
var mysql = require('mysql');
var dbConfig = require(path.resolve('config/db.config'));

var pool = mysql.createPool(dbConfig.mysql);

function poolConnection(callback) {
    //创建数据库连接池
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err)
        } else {
            callback && callback(connection)
            connection.release();//释放数据库连接
        }
    })

}

module.exports = poolConnection