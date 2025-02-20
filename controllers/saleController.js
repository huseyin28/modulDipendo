let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')

module.exports.getById = (req, res) => {
    let response = new ResponseObj()
    try {
        connection.query('SELECT * FROM sale_images WHERE saleId = ?', [req.params.id], (error, results, fields) => {
            if (error)  
                response.setError(error)
            else
                response.setData(results)
            res.json(response)
        });
    } catch (error) {
        response.setError(error.message)
        res.json(response)
    }
}