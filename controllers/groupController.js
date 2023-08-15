let sqlite3 = require('sqlite3')
let { open } = require('sqlite')
let ResponseObj = require('./ResponseObj')
let dbOptions = {
    filename: 'db.db',
    driver: sqlite3.cached.Database
};

class Group {
    static async getAll(req, res) {
        const db = await open(dbOptions);
        let response = new ResponseObj()
        try {
            response.setData(await db.all('SELECT id, name FROM groups'))
        } catch (error) {
            console.log(error);
            response.setError(error)
        } finally {
            res.json(response)
        }
    }

    static async get(req, res) {
        const db = await open(dbOptions);
        let response = new ResponseObj()
        try {
            response.setData(await db.get('SELECT id, name FROM groups WHERE id = ?', req.params.id))
        } catch (error) {
            response.setError(error)
        } finally {
            res.json(response)
        }
    }
}

module.exports = Group