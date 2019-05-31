# ums_backend

## express
命令行安装
```
npm i express -S
```
使用express生成器生成一个express项目
```
cd ums_backend
express .
```

## connect-history-api-fallback
由于前端使用了vue-router，在浏览器地址栏直接访问url时无法识别路由，需要使用connect-history-api-fallback中间件来处理，详情可查看connect-history-api-fallback官网（https://github.com/bripkens/connect-history-api-fallback）
命令行安装
```
npm i connect-history-api-fallback -S
```
app.js中引入
```
var history = require('connect-history-api-fallback');
```
使用connect-history-api-fallback（注意：须在静态资源配置前，即`app.use(express.static(path.join(__dirname, 'dist')));`前使用）
```
app.use(history());
```

# mysql
配置mysql连接信息，新建db.config.js，写入并保存
```
module.exports = {
    mysql: {
        host: 'X.X.X.X',//数据库所在服务器的ip地址
        user: 'root',//数据库用户名
        password: '*******',//数据库密码
        database: 'ums_db',//数据库名
        useConnectionPooling: true//使用连接池
    }
}
```
创建poolConnection.js，引入mysql模块和db.config.js，并创建数据库连接池
```
var path = require('path');
var mysql = require('mysql');
var dbConfig = require(path.resolve('config/db.config'));
var pool = mysql.createPool(dbConfig.mysql);
```
使用数据库连接池获取连接，对数据库一顿操作后记得使用`connection.release();`释放
```
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
```
最后导出poolConnection
```
module.exports = poolConnection
```