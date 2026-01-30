let ResponseObj = require('./ResponseObj')
let connection = require('./DBManager')


class Person {
    static getAll(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT id,name,surname,birthday,shoe,trousers,tshirt,jacket FROM persons', function (error, results, fields) {
                if (error)
                    response.setError(error)
                else
                    response.setData(results)
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static add(req, res) {
        let response = new ResponseObj()
        try {
            let post = req.body
            connection.query('INSERT INTO persons (name,surname,birthday,shoe,trousers,tshirt,jacket) VALUES (?,?,?,?,?,?,?)', [post.name, post.surname, post.birthday, post.shoe, post.trousers, post.tshirt, post.jacket], function (error, results, fields) {
                if (error) response.setError(error)
                else response.setData(results)
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static getById(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('SELECT id,name,surname,birthday,shoe,trousers,tshirt,jacket FROM persons WHERE id=?', [req.params.id], function (error, results, fields) {
                if (error) response.setError(error)
                else response.setData(results[0])
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static update(req, res) {
        let response = new ResponseObj()
        try {
            let post = req.body
            connection.query('UPDATE persons SET name=?, surname=?, birthday=?, shoe=?, trousers=?, tshirt=?, jacket=? WHERE id=?', [post.name, post.surname, post.birthday, post.shoe, post.trousers, post.tshirt, post.jacket, req.params.id], function (error, results, fields) {
                if (error) response.setError(error)
                else response.setData(post)
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }

    static delete(req, res) {
        let response = new ResponseObj()
        try {
            connection.query('DELETE FROM persons WHERE id=?', [req.params.id], function (error, results, fields) {
                if (error) response.setError(error)
                else response.setData(results)
                res.json(response)
            })
        } catch (error) {
            console.log(error);
            response.setError(error)
            res.json(response)
        }
    }
}

module.exports = Person