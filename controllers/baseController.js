const axios = require('axios');
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
}

module.exports = baseController