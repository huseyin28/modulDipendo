const express = require('express');
const router = express.Router();
const pool = require('../controllers/DBManager'); 
const ResponseObj = require('../controllers/ResponseObj')

router.post('/sale', async function (req, res) {
    let response = new ResponseObj()
    if(!req.files || !req.files.images){
        console.log("img seçilmedi")
    }else if(!req.files.images.length){
        console.log(req.files.images.name)
    }else{
        console.log("birden fazla img seçildi")
    }
    res.json(response)
    // const {persons,saleId} = req.body;
    // const uploadedFiles = req.files;

    // let response = new ResponseObj()
    // try {
    //     console.log(req.files);
        
    //     if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
    //         pool.query(`INSERT INTO sale_images (saleId, file_name, file_path, selected_names) VALUES (?, ?, ?, ?)`, [Number(saleId), '', '', persons], (error) => {
    //             if(error) console.log(error);
    //         });
    //     } else {
    //         // for (let i = 0; i < uploadedFiles.length; i++) {
    //         //     let file = uploadedFiles[i]
    //         //     let uploadPath = __dirname + '/../public/images/sales/' + file.filename;
    //         //     uploadSaleImg(file,uploadPath)
    //         // }
    //     }
    //     res.json(response)
    // } catch (error) {
    //     console.log(error);
    //     res.json(response)
    // }
})

function uploadSaleImg(file,uploadPath){
    file.mv(uploadPath, (err) => {
        if (!err) 
            pool.query(`INSERT INTO sale_images (saleId, file_name, file_path, selected_names) VALUES (?, ?, ?,?)`,[Number(saleId), file.filename, uploadPath, persons]);
    })
}

module.exports = router;