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

            // Query sonucunu önce kontrol et
            const queryResult = await connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [purchaseItemId]);
            console.log('Query result:', queryResult); // Debug için

            // Eğer result array değilse veya boşsa
            if (!queryResult || !Array.isArray(queryResult)) {
                // Hiç kayıt yoksa INSERT yap
                await connection.query('INSERT INTO purchaseItems (purchaseItemId, location) VALUES (?, ?)', [purchaseItemId, location]);
            } else {
                const [rows] = queryResult;
                if (rows && rows.length > 0) {
                    await connection.query('UPDATE purchaseItems SET location = ? WHERE purchaseItemId = ?', [location, purchaseItemId]);
                } else {
                    await connection.query('INSERT INTO purchaseItems (purchaseItemId, location) VALUES (?, ?)', [purchaseItemId, location]);
                }
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

            const queryResult = await connection.query('SELECT * FROM purchaseItems WHERE purchaseItemId = ?', [purchaseItemId]);

            // Destructuring yerine direct access kullan
            let rows;
            if (Array.isArray(queryResult)) {
                rows = queryResult[0];
            } else {
                rows = queryResult;
            }

            if (rows && rows.length > 0) {
                response.setData(rows[0]);
            } else {
                response.setError('No data found');
            }
        } catch (error) {
            console.error('Error in getpurchaseItem:', error);
            response.setError(error.message);
        } finally {
            res.send(response);
        }
    }
}

module.exports = baseController