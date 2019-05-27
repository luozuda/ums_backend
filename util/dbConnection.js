var path = require('path');
var mysql = require('mysql');
var dbConfig = require(path.resolve('config/db.config'));

var connection = mysql.createConnection(dbConfig.mysql);
connection.connect(err => {
    if (err) {
        throw err
    }
})

module.exports = connection