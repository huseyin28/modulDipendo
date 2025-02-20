let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')



module.exports.getById = (req, res) => {
    let response = new ResponseObj()

    response.setData('Merhaba '+req.params.id);
    res.json(response)
}