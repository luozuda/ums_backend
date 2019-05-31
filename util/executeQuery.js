function executeQuery(connection, sql, params, callback) {
    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log(err)
            console.log('[EXECUTEQUERY ERROR] - ', err.message);
        } else {
            console.log("[EXECUTEQUERY SUCCESS] - [SQL] - " + sql)
            console.log("[EXECUTEQUERY SUCCESS] - [PARAMS] - " + params)
            console.log("[EXECUTEQUERY SUCCESS] - [RESULT] - " + JSON.stringify(result))
            callback && callback(result)
        }
    })
}

module.exports = executeQuery