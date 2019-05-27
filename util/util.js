var fs = require('fs')
var crypto = require('crypto')//加密插件

module.exports = {
    md5(data) {//加密
        let hash = crypto.createHash('md5');
        return hash.update(data).digest('base64');
    },
    createRandomId() {//生成随机的唯一的id
        return (Math.random() * 10000000).toString(16).substr(0, 4) + new Date().getTime();
    },
    readFile(file, res, callback) {
        //readFileSync同步读取文件,readFile异步读取文件
        console.log(1)
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                res.json({ code: 2, msg: err })
                console.error(err)
                throw error
            } else {
                callback && callback(data)
            }
        })
    }
}