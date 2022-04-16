// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    const sql = `select id, username, nickname, email from user where id=?`
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.commsg(err)
        if (results.length !== 1) return res.commsg('获取用户信息失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0],
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update user set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.commsg(err)
        console.log(results);
        if (results.affectedRows !== 1) return res.commsg('更新用户的基本信息失败！')
        // 成功
        res.commsg('更新用户信息成功！', 0)
    })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    const sql = `select * from user where id=?`
    // 执行根据 id 查询用户的信息的 SQL 语句
    // ===============疑惑=============
    // 这里为什么是req.user.id而不是req.body.id存在疑惑
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.commsg(err)
        if (results.length !== 1) return res.commsg('用户不存在！')

        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.commsg('旧密码错误！')

        // 定义更新密码的 SQL 语句
        const sql = `update user set password=? where id=?`
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.commsg(err)
            if (results.affectedRows !== 1) return res.commsg('更新密码失败！')
            // 成功
            res.commsg('更新密码成功', 0)
        })
    })
}