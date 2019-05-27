// 操作数据库的sql语句
module.exports = {
    selectAccount: 'SELECT * FROM account',
    insertAccount: 'INSERT INTO account(username,password) VALUES(?,?)',

    selectAccountLogin: 'SELECT * FROM account_login',
    insertAccountLogin: 'INSERT INTO account_login(username,token,expires) VALUES(?,?,?)',

    selectCustomer: 'SELECT * FROM customer',
    insertCustomer: 'INSERT INTO customer(name,phone,address,remarks) VALUES(?,?,?,?)',
}