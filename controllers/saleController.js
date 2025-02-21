let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')
const Jimp = require("jimp");
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
        const { preparers, saleId } = req.body;
        let filenameList = [];
        if (!req.files || !req.files.images) { 
            
        } else if (!req.files.images.length) { 
            filenameList.push(saleId + '.' + req.files.images.name.split('.').at(-1))
            uploadSaleImg(req.files.images, filename)
        } else {
            for (let i = 0; i < req.files.images.length; i++) {
                filenameList.push(`${saleId}-${i}.` + req.files.images[i].name.split('.').at(-1))
                uploadSaleImg(req.files.images[i], filename)
            }
        }
        insertDB(saleId,JSON.stringify(filenameList),preparers)
        response.setData('OK')
        res.json(response)
    } catch (error) {
        response.setError(error)
        console.log(error)
        res.json(response)
    }
}

async function uploadSaleImg(file, filename) {
    let uploadTempPath = path.join(__dirname, '..', 'public', 'images', 'sales', 'temp', filename)
    let uploadPath = path.join(__dirname, '..', 'public', 'images', 'sales', filename)
    
    file.mv(uploadTempPath, async (err) => {
        if (!err) {
            const image = await Jimp.read(uploadTempPath);
            await image.resize(800, Jimp.AUTO).quality(70).writeAsync(uploadPath);
            //sharp(uploadTempPath).resize(1000).jpeg({ quality: 70 }).toFile(uploadPath).then(() => fs.unlinkSync(uploadTempPath)).catch(err => console.error("Hata:", err));
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