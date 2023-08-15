
let sqlite3 = require('sqlite3')
let { open } = require('sqlite')
let ResponseObj = require('./ResponseObj')
let dbOptions = {
    filename: 'db.db',
    driver: sqlite3.cached.Database
};

class Product {
    static async getByGroupId(req, res) {
        const db = await open(dbOptions);
        let response = new ResponseObj()
        try {
            response.setData(await db.all('SELECT id, name FROM products WHERE groupId=?', [req.params.groupId]))
        } catch (error) {
            console.log(error);
            response.setError(error)
        } finally {
            res.json(response)
        }
    }

    static async getById(req, res) {
        const db = await open(dbOptions);
        let response = new ResponseObj()
        try {
            response.setData(await db.get('SELECT * FROM products WHERE id=?', [req.params.id]))
        } catch (error) {
            console.log(error);
            response.setError(error)
        } finally {
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
                imgFile.name = Date.now() + imgFile.name
                let uploadPath = __dirname + '/../public/images/products/' + imgFile.name;

                await imgFile.mv(uploadPath, async function (err) {
                    if (err) {
                        console.log(err);
                        response.setError(err)
                        res.json(response)
                    } else {
                        const db = await open(dbOptions);
                        const result = await db.get('SELECT images FROM products WHERE id = ?', req.params.id)
                        let jsn = JSON.parse(result.images)
                        jsn.push(imgFile.name)
                        await db.run('UPDATE products SET images = ? WHERE id = ?', JSON.stringify(jsn), req.params.id)
                        response.setData(imgFile.name)
                        res.json(response)
                    }
                })
            }
        } catch (error) {
            response.setError(error)
            res.json(response)
        }
    }
}

module.exports = Product