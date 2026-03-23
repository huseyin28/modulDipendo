var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'hyyaevff_huseyin',
    password: 'Huseyin2219',
    database: 'hyyaevff_celsan'
});

// Bağlantıyı test etmek için ekleyin
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Bağlantı hatası:', err);
    } else {
        console.log('Bağlantı başarılı');
        conn.release();
    }
});

module.exports = connection