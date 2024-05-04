const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true
};

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions));

let conn = null

// init db
const initDB = async () => {
    conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_NAME
    })
}

// api
app.post('/api/login', async (req, res) => {
    try {
        const { user, password } = req.body

        const [results] = await conn.query('select * from employee where User = ?', user)

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
    }
})

// main
app.listen(process.env.PORT, async () => {
    await initDB()
    console.log('Server started on port ' + process.env.PORT)
})