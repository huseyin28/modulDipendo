const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
let Group = require('../controllers/groupController')
let Product = require('../controllers/productController')
let Sale = require('../controllers/saleController')
let Person = require('../controllers/personController')
const baseController = require('../controllers/baseController');

// API isteklerinde caching'i devre dışı bırak (304 hatasını önlemek için)
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

router.get('/group/get', Group.getAll)
router.get('/group/get/:id', Group.get)
router.get('/products/getByGroupId/:groupId', Product.getByGroupId)
router.get('/products/getById/:id', Product.getById)
router.get('/sales/getById/:id', Sale.getById)
router.get('/aut/getKey', baseController.getPublicKey)
router.get('/sales/getSevkList/:dt', Sale.getSevkList)
router.get('/purchaseItem/getpurchaseItem/:purchaseItemId', baseController.getpurchaseItem)
router.get('/qrcode/getlist', baseController.getQRCodeList)
router.get('/qrcode/delete/:id', baseController.deleteQRCode)
router.get('/qrcode/print', baseController.printQRCode)

router.post('/qrcode/add', baseController.addQRCode)
router.post('/purchaseItem/sayim/complete', Product.SayimComplete)
router.post('/sales/setDeliveryTime', Sale.setDeliveryTime)
router.post('/products/update/:id', Product.update)
router.post('/products/imgUpload/:id', Product.imgUpload)
router.post('/products/add/', Product.add)
router.get('/person/get', Person.getAll)
router.get('/person/get/:id', Person.getById)
router.post('/person/add', Person.add)
router.post('/person/update/:id', Person.update)
router.delete('/person/delete/:id', Person.delete)
router.post('/purchaseItem/updateLocation', baseController.updateKonum)
router.post('/purchaseItem/sayim', Product.insertSayim)

router.delete('/products/removeImage/:pid', Product.removeImage)





module.exports = router