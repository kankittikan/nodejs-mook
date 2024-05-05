const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
    try {
        const { user, password } = req.body

        const [results] = await conn.query('select * from employee where User = ?', String(user))

        if (!results[0]) {
            res.status(401).json({
                message: "ไม่พบผู้ใช้"
            })
            return false
        }

        const userData = results[0]
        const valid = await bcrypt.compare(password, userData.password)

        if (!valid) {
            res.status(401).json({
                message: "รหัสผ่านไม่ถูกต้อง"
            })
            return false
        }

        // sign jwt
        const token = jwt.sign({
            userId: userData.EN,
            name: userData.name + ' ' + userData.last_name
        }, process.env.SECRET, { expiresIn: '1h' })

        res.cookie('token', token)

        res.json({
            message: 'OK'
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
        console.log(error)
    }
}