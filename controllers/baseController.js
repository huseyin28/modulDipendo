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

    static async getQRCodeList(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT * FROM qrcodeprint WHERE isprint = 0 GROUP BY kimlik', (err, result) => {
                if (err) {
                    response.setError(err);
                } else {
                    response.setData(result);
                }
                res.json(response);
            });
        }
        catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async printQRCode(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('UPDATE qrcodeprint SET isprint = 1 WHERE isprint = 0', (err, result) => {
                if (err) {
                    response.setError(err);
                }
                else {
                    response.setData({ updatedCount: result.affectedRows });
                }
                res.json(response);
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async addQRCode(req, res) {
        let response = new ResponseObj()
        try {
            const { codes } = req.body;

            if (!Array.isArray(codes) || codes.length === 0) {
                response.setError('Codes must be a non-empty array');
                return res.json(response);
            }

            const values = codes.map(code => [code, 0]);
            console.log(values);
            connection.query('INSERT INTO qrcodeprint (kimlik, isprint) VALUES ?', [values], (err, result) => {
                if (err) {
                    response.setError(err);
                } else {
                    response.setData({ insertedCount: result.affectedRows, codes });
                }
                res.json(response);
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async deleteQRCode(req, res) {
        let response = new ResponseObj()
        try {
            const { id } = req.params;
            connection.query('DELETE FROM qrcodeprint WHERE id = ?', [id], (err, result) => {
                if (err) {
                    response.setError(err);
                } else {
                    response.setData({ deletedCount: result.affectedRows });
                }
                res.json(response);
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
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
                    return res.json(response); // sadece burada gönder
                }
                if (!result || result.length === 0) {
                    connection.query(`INSERT INTO purchaseItems (purchaseItemId, location) VALUES (?, ?)`, [purchaseItemId, location], (err, result) => {
                        if (err) {
                            response.setError(err);
                        } else {
                            response.setData({ purchaseItemId, location });
                        }
                        return res.json(response); // sadece burada gönder
                    });
                } else {
                    connection.query(`UPDATE purchaseItems SET location = ? WHERE purchaseItemId = ?`, [location, purchaseItemId], (err, result) => {
                        if (err) {
                            response.setError(err);
                        } else {
                            response.setData({ purchaseItemId, location });
                        }
                        return res.json(response); // sadece burada gönder
                    });
                }
            });
        } catch (error) {
            response.setError(error.message);
            return res.json(response);
        }
    }
}

module.exports = baseController