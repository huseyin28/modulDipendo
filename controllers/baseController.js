const axios = require('axios');
let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')


class baseController {
    static async getPublicKey(req, res) {
        axios.post('https://app.dipendo.com/oauth/token', {
            "username": "depo@celsancelik.com",
            "password": "12345678",
            "grant_type": "password",
            "client_id": "DipendoWeb"
        })
            .then(function (response) {
                console.log(response);
                res.send({ key: response.data.token_type + ' ' + response.data.access_token })
            })
            .catch(function (error) {
                res.send({ error: error });
            });
    }

    static async getpurchaseItem(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [req.params.purchaseItemId], (err, result) => {
                if (err) {
                    response.setError(err);
                } else if (!result || result.length === 0) {
                    response.setError('Kayıt bulunamadı');
                } else {
                    response.setData(result[0]);
                }
                res.json(response);
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async updateKonum(req, res) {
        let response = new ResponseObj()
        try {
            const { purchaseItemId, location } = req.body;
            connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [purchaseItemId], (err, result) => {
                if (err) {
                    response.setError(err);
                    res.json(response);
                } else if (!result || result.length === 0) {
                    connection.query(`INSERT INTO purchaseItems (purchaseItemId, location) VALUES (?, ?)`, [purchaseItemId, location], (err, result) => {
                        if (err) {
                            response.setError(err);
                        } else {
                            response.setData({ purchaseItemId, location });
                        }
                        res.json(response);
                    });
                } else {
                    connection.query(`UPDATE purchaseItems SET location = ? WHERE purchaseItemId = ?`, [location, purchaseItemId], (err, result) => {
                        if (err) {
                            response.setError(err);
                            return res.json(response);
                        }
                        response.setData({ purchaseItemId, location });
                    });
                }
                res.json(response);
            });
        } catch (error) {
            response.setError(error.message);
        } finally {
            res.send(response);
        }


    }
}

module.exports = baseController