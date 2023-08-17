let ResponseObj = require('./ResponseObj')
let connection = require('./DBManager')

class Group {
    static getAll(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT id, name FROM groups', function (error, results, fields) {
                if (error)
                    response.setError(error)
                else
                    response.setData(results)
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static get(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT id, name FROM groups WHERE id = ?', [req.params.id], (err, result) => {
                if (err)
                    response.setError(err)
                else
                    response.setData(result[0])
                res.json(response)
            })
        } catch (error) {
            response.setError(error)
            res.json(response)
        }
    }
}

module.exports = Group