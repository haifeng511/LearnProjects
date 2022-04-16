/**
 * 定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.register = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from user where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.commsg(err)
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            return res.commsg('用户名被占用，请更换其他用户名！')
        }
        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 定义插入新用户的 SQL 语句
        const sql = 'insert into user set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.commsg(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.commsg('注册用户失败，请稍后再试！')
            // 注册用户成功
            res.commsg('注册成功！', 0)
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    const sql = `select * from user where username=?`
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.commsg(err)
        if (results.length !== 1) return res.commsg('登录失败！')
        // TODO：判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.commsg('登录失败！')

        // TODO：在服务器端生成 Token 的字符串
        const user = { ...results[0], password: ''}
        // 对用户的信息进行加密，生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // 调用 res.send() 将 Token 响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr,
        })
    })
}