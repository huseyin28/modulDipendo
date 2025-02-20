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
        });
    } catch (error) {
        response.setError(error.message)
    }finally{
        res.json(response)
    }
}