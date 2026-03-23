var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'hyyaevff',
    password: 'M*THb4KSk-G8',
    database: 'hyyaevff_celsan'
})

module.exports = connection