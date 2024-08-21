let connection = require('./DBManager')
const fs = require('node:fs');
let ResponseObj = require('./ResponseObj')


class Product {
    static async getByGroupId(req, res) {
        let response = new ResponseObj()
        let sqlString = 'SELECT id, name, shortName FROM products WHERE groupId=?'
        let sqlParams = [req.params.groupId]
        if (req.query.text != null && req.query.text != '') {
            sqlString += ` AND name LIKE '%${req.query.text}%'`
        }
        if (req.query.nonImg == "2") {
            sqlString += ` AND images LIKE '[]'`
        } else if (req.query.nonImg == "1") {
            sqlString += ` AND images NOT LIKE '[]'`
        }
        try {
            connection.query(sqlString, sqlParams, function (error, results, fields) {
                if (error)
                    response.setError(error)
                else
                    response.setData(results)
                res.json(response)
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async add(req, res) {
        let response = new ResponseObj()
        try {
            var post = req.body;
            connection.query('INSERT INTO products SET ?', post, function (error, results, fields) {
                if (error) response.setError(error);
                else response.setData(results)
                res.json(response)
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async update(req, res) {
        let response = new ResponseObj()
        try {
            var post = req.body;
            connection.query('UPDATE products SET shortName=?, brand=? WHERE id=?;', [post.shortName, post.brand, req.params.id], function (error, results, fields) {
                if (error) response.setError(error);
                else response.setData(post)
                res.json(response)
            });
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async getById(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT * FROM products WHERE id=?', [req.params.id], (err, result) => {
                if (err) response.setError(err)
                else response.setData(result[0])
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static async imgUpload(req, res) {
        let response = new ResponseObj()
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                response.setError('Lütfen görsel seçiniz')
                res.json(response)
            } else {
                let imgFile = req.files.img
                let imgName = imgFile.name.split('.')
                imgName = imgName[imgName.length - 1]
                imgFile.name = req.params.id + Date.now() + '.' + imgName
                let uploadPath = __dirname + '/../public/images/products/' + imgFile.name;

                await imgFile.mv(uploadPath, async function (err) {
                    if (err) {
                        console.log(err);
                        response.setError(err)
                        res.json(response)
                    } else {
                        connection.query('SELECT images FROM products WHERE id = ?', [req.params.id], (error, result) => {
                            if (error) {
                                response.setError(error)
                                res.json(response)
                            } else {
                                let jsn = JSON.parse(result[0].images)
                                jsn.push({
                                    width: req.body.width,
                                    height: req.body.height,
                                    img: imgFile.name
                                })
                                connection.query('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(jsn), req.params.id], (err2, result2) => {
                                    if (err2) {
                                        response.setError(error)
                                    } else {
                                        response.setData({
                                            width: req.body.width,
                                            height: req.body.height,
                                            img: imgFile.name
                                        })
                                    }
                                    res.json(response)
                                })
                            }

                        })
                    }
                })
            }
        } catch (error) {
            response.setError(error)
            res.json(response)
        }
    }

    static async removeImage(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT * FROM products WHERE id=?', [req.params.pid], (err, result) => {
                if (err) {
                    response.setError(err)
                    res.json(response)
                } else {
                    let images = JSON.parse(result[0].images)
                    let index = images.findIndex(({ img }) => img === req.body.src)

                    if (index >= 0) {
                        images.splice(index, 1)
                        fs.unlinkSync(__dirname + '/../public/images/products/' + req.body.src);
                    }
                    connection.query('UPDATE products SET images=? WHERE id=?', [JSON.stringify(images), req.params.pid], (err2, result2) => {
                        if (err2) response.setError(err2)
                        else response.setData([])
                        res.json(response)
                    })
                }
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }
}

module.exports = Product