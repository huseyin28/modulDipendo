let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')
const sharp = require("sharp");
const path = require('path')
const db = require('../controllers/DBManager');
const fs = require('fs')

module.exports.getById = (req, res) => {
    let response = new ResponseObj()
    try {
        connection.query('SELECT * FROM sale_images WHERE saleId = ?', [req.params.id], (error, results, fields) => {
            if (error)
                response.setError(error)
            else
                response.setData(results)
            res.json(response)
        });
    } catch (error) {
        response.setError(error.message)
        res.json(response)
    }
}

module.exports.imgUpload = async (req, res) => {
    let response = new ResponseObj()
    try {
        const { persons, saleId } = req.body;
        let filename = '';
        if (!req.files || !req.files.images) { 
            insertDB(saleId, filename, persons);
        } else  { 
            filename = saleId + '.' + req.files.images.name.split('.').at(-1);
            uploadSaleImg(req.files.images, filename, saleId, persons)
        } 
        response.setData('OK')
        res.json(response)
    } catch (error) {
        response.setError(error)
        console.log(error)
        res.json(response)
    }
}

function uploadSaleImg(file, filename, saleId, selected_names) {
    let uploadTempPath = path.join(__dirname, '..', 'public', 'images', 'sales', 'temp', filename)
    let uploadPath = path.join(__dirname, '..', 'public', 'images', 'sales', filename)
    
    file.mv(uploadTempPath, (err) => {
        if (!err) {
            insertDB(saleId, filename, selected_names)
            sharp(uploadTempPath).resize(1000).jpeg({ quality: 70 }).toFile(uploadPath).then(() => fs.unlinkSync(uploadTempPath)).catch(err => console.error("Hata:", err));
        } else
            console.error(err)
    })
}

function insertDB(saleId, filename, preparers) {
    db.query("SELECT * FROM sale_images WHERE saleId = ?", [saleId], (err, results) => {
        if (err) throw err;
        if (results.length > 0)
            console.log("Ürünler:", results.length);
        else
            db.query(`INSERT INTO sale_images (saleId, filename, preparers) VALUES (?, ?, ?)`, [Number(saleId), filename, preparers]);
    });
}