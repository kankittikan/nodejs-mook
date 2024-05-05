const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const cors = require('cors')

//import controlers
const authMiddleware = require('./middlewares/authMiddleware')
const loginController = require('./controllers/loginController')
const typeRepairController = require('./controllers/typeRepairController')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true
};

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions));

global.conn = null

// init db
const initDB = async () => {
    conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_NAME
    })
}

// controller
app.post('/api/login', loginController)
app.get('/api/get/typeRepair', authMiddleware, typeRepairController)

// main
app.listen(process.env.PORT, async () => {
    await initDB()
    console.log('Server started on port ' + process.env.PORT)
})