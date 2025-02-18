const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();
const pool = require('../controllers/DBManager'); // MySQL bağlantı dosyan

// Upload klasörünü oluştur (Eğer yoksa)
const uploadDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadDir);

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Dosyalar "uploads" klasörüne kaydedilir
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Benzersiz dosya adı oluştur
    }
});
const upload = multer({ storage: storage });

router.post('/saleold', upload.array('files[]', 10), async (req, res) => {
    try {
        const selectedNames = req.body.selectedNames;
        const saleId = req.body.saleId;
        const uploadedFiles = req.files;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            await pool.query(`INSERT INTO sale_images (saleId, file_name, file_path, selected_names) VALUES (?, ?, ?)`,
                [saleId, ``, ``, JSON.stringify(selectedNames)]);
        } else {
            for (const file of uploadedFiles) {
                await pool.query(`INSERT INTO sale_images (saleId, file_name, file_path, selected_names) VALUES (?, ?, ?)`,
                    [saleId, file.filename, `/uploads/${file.filename}`, JSON.stringify(selectedNames)]);
            }
        }

        res.json({
            status: 'success',
            message: 'Dosyalar başarıyla yüklendi ve veritabanına kaydedildi.',
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Sunucu hatası!' });
    }
});



//!   Dikkat !  Bu kod product image yüklemeden alındı. Yukardaki kod ve ilgili frontend scripti ile uyarlanacak.
//!     Dikkat ! Burda birden fazla dosya seçiyoruz (for kullanılacak her dosya için)

router.post('/sale', async function (req, res) {
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
                        }
                    })
                }
            })
        }
    } catch (error) {
        response.setError(error)
        res.json(response)
    }
})







module.exports = router;
