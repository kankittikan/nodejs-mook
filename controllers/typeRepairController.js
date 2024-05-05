module.exports = async (req, res) => {

    try {
        const [results] = await conn.query('select name from type')

        res.json({
            results: results
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error'
        })
        console.log(error)
    }
}