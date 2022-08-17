const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');

router.get('/get', (req, res) => {
    let response = {success : false}
    try {
        fs.readFile('auth.txt', 'utf8', function(err, data){
            if(err) {
                response.message = "Key okunamadı"
            }else{
                response.data = data;
                response.success = true;
            }
        });
    } catch (error) {
        response.message = "Sunucu kaynaklı hata oluştu lütfen daha sonra tekrar deneyin."
        response.error = error
    }finally{
        res.send(response)
    }
})

router.post('/set', (req, res) => {
    let response = {success : false}
    try {
        fs.writeFile(path.join(__dirname,"/auth.txt"), req.body.auth, err => {
            if (err) {
                response.message = "İşlem başarısız";
                response.error = err
            }
            response.success = true
        });
    } catch (error) {
        response.message = "İşlem başarısız";
        response.error = error
    } finally {
        res.json(response)
    }
})

module.exports = router