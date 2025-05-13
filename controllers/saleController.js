let connection = require('./DBManager')
let ResponseObj = require('./ResponseObj')
const path = require('path')
const fs = require('fs')
const sharp = require("sharp");

module.exports.getById = (req, res) => {
    let response = new ResponseObj()
    try {
        connection.query('SELECT * FROM sales WHERE saleId = ?', [req.params.id], (error, results, fields) => {
            if (error)
                response.setError(error)
            else {
                if (results.length > 0)
                    response.setData(results[0])
                else {
                    connection.query('INSERT INTO sales (saleId, preparers, statu, images,shipmentControl) VALUES (?,?,?,?,?)', [req.params.id, '[]', 1, '[]', '{}'])
                    response.setData({
                        saleId: req.params.id,
                        preparers: '[]',
                        statu: 1,
                        images: '[]',
                        shipmentControl: '{}'
                    })
                }
            }
            res.json(response)
        });
    } catch (error) {
        response.setError(error.message)
        res.json(response)
    }
}

module.exports.imgUpload = async (req, res) => {
    let response = new ResponseObj()
    let filename;
    try {
        const { preparers, saleId } = req.body;
        let filenameList = [];
        if (!req.files || !req.files.images) {

        } else if (!req.files.images.length) {
            filename = saleId + (+new Date()) + '.' + req.files.images.name.split('.').at(-1)

            filenameList.push(filename)
            uploadSaleImg(req.files.images, filename)
        } else {
            for (let i = 0; i < req.files.images.length; i++) {
                filename = `${saleId}-${i}.` + (+new Date()) + req.files.images[i].name.split('.').at(-1)

                filenameList.push(filename)
                uploadSaleImg(req.files.images[i], filename)
            }
        }
        saveDB(saleId, filenameList, preparers)
        response.setData('OK')
        res.json(response)
    } catch (error) {
        response.setError(error)
        console.log(error)
        res.json(response)
    }
}

module.exports.setDeliveryTime = (req, res) => {
    let response = new ResponseObj()

    try {
        const { saleId, deliveryTime, statu } = req.body
        const d = new Date(deliveryTime);
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);

        connection.query('SELECT * FROM sales WHERE saleId = ?', [saleId], (error, results, fields) => {
            if (error) {
                response.setError(error)
            } else {
                if (results.length > 0) {
                    connection.query("UPDATE sales SET deleveryDate = ?, statu=? WHERE saleId = ?", [d, statu, saleId])
                    response.setData('OK')
                }
            }
            res.json(response)
        });
    } catch (error) {
        response.setError(error.message)
        res.json(response)
    }
}

async function uploadSaleImg(file, filename) {
    let uploadTempPath = path.join(__dirname, '..', 'public', 'images', 'sales', 'temp', filename)
    let uploadPath = path.join(__dirname, '..', 'public', 'images', 'sales', filename)

    file.mv(uploadTempPath, async (err) => {
        if (!err) {
            await sharp(uploadTempPath)
                .resize(1000)
                .jpeg({ quality: 70 })
                .toFile(uploadPath);
            fs.unlinkSync(uploadTempPath);
        } else
            console.error(err)
    })
}

function saveDB(saleId, images, preparers) {
    connection.query('SELECT * FROM sales WHERE saleId = ?', [saleId], (error, results, fields) => {
        if (error)
            response.setError(error)
        else {
            if (results.length > 0) {
                let oldSale = results[0]
                oldSale.images = JSON.parse(oldSale.images)
                let newImages = oldSale.images.concat(images)
                connection.query(
                    "UPDATE sales SET preparers = ?, images=? WHERE saleId = ?",
                    [preparers, JSON.stringify(newImages), saleId]
                );
            }
        }
    })
}

