const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Satış',
        scripts: `<script src="/public/scripts/index.js"></script>`
    })
})

router.get('/detay', (req, res) => {
    res.render('detay',{
        title: 'Detay',
        scripts: `<script src="/public/scripts/detay.js"></script>`
    })
})

router.get('/formPrint/:id', (req, res) => {
    res.render('formPrint', {
        layout : false,
        scripts: `<script src="/public/scripts/formPrint.js"></script>`,
        saleId : `<script>const saleId = ${req.params.id}; </script>`
    })
})

router.get('/purchaseItem/detay/:id', (req, res) => {
    res.render('purchaseItem', {
        title: 'Ürün Detayı',
        scripts: `<script>const purchaseItemId = ${req.params.id}; </script><script src="/public/scripts/purchaseItem.js"></script>`,
    })
})

module.exports = router