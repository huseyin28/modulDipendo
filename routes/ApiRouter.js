const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
let Group = require('../controllers/groupController')
let Product = require('../controllers/productController')
let Base = require('../controllers/baseController')

router.get('/group/get', Group.getAll)
router.get('/group/get/:id', Group.get)
router.get('/products/getByGroupId/:groupId', Product.getByGroupId)
router.get('/products/getById/:id', Product.getById)
router.get('/aut/getKey', Base.getPublicKey)

router.post('/products/imgUpload/:id', Product.imgUpload)
router.post('/products/add/', Product.add)
router.put('/products/update/', Product.update)
router.delete('/products/removeImage/:pid', Product.removeImage)


module.exports = router