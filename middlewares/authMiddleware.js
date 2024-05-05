const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).json({
            message: 'Unauthorized'
        })
        return false
    }

    // token validation
    try {
        jwt.verify(token, process.env.SECRET)
    } catch (error) {
        res.status(401).json({
            message: 'token not valid',
            error
        })
        return false
    }

    next()
}