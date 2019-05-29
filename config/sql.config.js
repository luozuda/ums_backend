// 操作数据库的sql语句
module.exports = {
    //account
    selectAccount: 'SELECT * FROM account WHERE username = ? ',
    insertAccount: 'INSERT INTO account(username,password) VALUES(?,?) ',

    //customer
    selectCustomer: 'SELECT * FROM customer WHERE cust_acc_id = ? ',
    searchCustomer: 'SELECT * FROM customer WHERE name = ? AND cust_acc_id = ? ',
    insertCustomer: 'INSERT INTO customer(name,phone,sex,address,remarks,cust_acc_id) VALUES(?,?,?,?,?,?) ',
    deleteCustomer: 'DELETE FROM customer WHERE name = ? AND cust_acc_id = ? ',
    updateCustomer: 'UPDATE customer SET phone = ? ,sex = ? , address = ? , remarks = ? WHERE name = ? and cust_acc_id = ? '
}