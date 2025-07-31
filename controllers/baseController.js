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

    static async updateKonum(req, res) {
        let response = new ResponseObj()
        try {
            const { purchaseItemId, location } = req.body;
            const [rows] = await connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [purchaseItemId]);
            if (rows.length > 0) {
                await connection.query('UPDATE purchaseItems SET location = ? WHERE purchaseItemId = ?', [location, purchaseItemId]);
            } else {
                await connection.query('INSERT INTO purchaseItems (purchaseItemId, location) VALUES (?, ?)', [purchaseItemId, location]);
            }
            response.setData({ purchaseItemId, location });
        } catch (error) {
            response.setError(error.message);
        } finally {
            res.send(response);
        }
    }

    static async getpurchaseItem(req, res) {
        let response = new ResponseObj()
        try {
            const { purchaseItemId } = req.params;
            const [rows] = await connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [purchaseItemId]);
            if (rows.length > 0) {
                response.setData(rows[0]);
            } else {
                response.setError('No data found');
            }
        } catch (error) {
            response.setError(error.message);
        } finally {
            res.send(response);
        }
    }
}

module.exports = baseController