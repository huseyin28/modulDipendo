const express = require('express');
const router = express.Router();
const path = require('path')
const pool = require('../controllers/DBManager');
const ResponseObj = require('../controllers/ResponseObj')

router.post('/sale', async function (req, res) {
    let response = new ResponseObj()
    try {
        const { persons, saleId } = req.body;
        let uploadPath = '';
        let filename = '';
        if (!req.files || !req.files.images) { // img seçilmediyse 
            insertDB(saleId, filename, uploadPath, persons);
        } else if (!req.files.images.length) { // Eğer tek img seçildiyse obj olarak gelicek
            filename = saleId + '.' + req.files.images.name.split('.').at(-1);
            uploadPath = path.join(__dirname, '..', 'public', 'images', 'sales', filename)
            uploadSaleImg(req.files.images, filename, uploadPath, saleId, persons)
        } else { // birden fazla img seçildiyse dizi şeklinde gelecek
            for (let i = 0; i < req.files.images.length; i++) {
                filename = `${saleId}-${i}.` + req.files.images[i].name.split('.').at(-1);
                uploadPath = path.join(__dirname, '..', 'public', 'images', 'sales', filename)
                uploadSaleImg(req.files.images[i], filename, uploadPath, saleId, persons)
            }
        }
        response.setData('OK')
    } catch (error) {
        response.setError(error)
        console.log(error);
    }finally{
        res.json(response)
    }
})

function uploadSaleImg(file, filename, uploadPath, saleId, selected_names) {
    file.mv(uploadPath, (err) => {
        if (!err)
            insertDB(saleId, filename, uploadPath, selected_names)
        else
        console.error(err)
    })
}

function insertDB(saleId, file_name, file_path, selected_names) {
    pool.query(
        `INSERT INTO sale_images (saleId, file_name, file_path, selected_names) VALUES (?, ?, ?,?)`,
        [Number(saleId), file_name, file_path, selected_names]);
}

module.exports = router;