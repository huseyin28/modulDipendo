const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
let Group = require('../controllers/groupController')
let Product = require('../controllers/productController')

router.get('/group/get', Group.getAll)
router.get('/group/get/:id', Group.get)
router.get('/products/getByGroupId/:groupId', Product.getByGroupId)
router.get('/products/getById/:id', Product.getById)

router.post('/products/imgUpload/:id', Product.imgUpload)


module.exports = router