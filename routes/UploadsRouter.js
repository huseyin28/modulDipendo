const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController')

router.post('/sale', saleController.imgUpload)

module.exports = router;