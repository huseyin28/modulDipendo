const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Satış',
        scripts: `<script src="/public/scripts/index.js?nocache=${Math.random()}"></script>`
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        layout: false
    })
})

router.get('/capacity', (req, res) => {
    res.render('capacity', {
        title: 'Kapasite Hesapla',
        scripts: `<script src="/public/scripts/capacity.js?nocache=${Math.random()}"></script>`
    })
})


router.get('/qrcodescan', (req, res) => {
    res.render('qrcodescan', {
        title: 'QR Code Tarat',
        scripts: `<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script><script src="/public/scripts/qrcodescan.js?nocache=${Math.random()}"></script>`
    })
})

router.get('/detay', (req, res) => {
    res.render('detay', {
        title: 'Detay',
        scripts: `<script src="/public/scripts/detay.js?nocache=${Math.random()}"></script>`
    })
})

router.get('/formPrint/:id', (req, res) => {
    res.render('formPrint', {
        layout: false,
        scripts: `<script src="/public/scripts/formPrint.js?nocache=${Math.random()}"></script>`,
        saleId: `<script>const saleId = ${req.params.id}; </script>`
    })
})

router.get('/printQRCode', (req, res) => {
    res.render('printQRCode', {
        layout: false,
    })
})

router.get('/purchaseItem/detay/:id', (req, res) => {
    res.render('purchaseItem', {
        title: 'Ürün Detayı',
        scripts: `<script>const purchaseItemId = ${req.params.id}; </script><script src="/public/scripts/purchaseItem.js?nocache=${Math.random()}"></script>`,
    })
})

router.get('/girisBekleyen', (req, res) => {
    res.render('girisBekleyen', {
        title: 'Depo Giriş Bekleyenler',
        scripts: `<script src="/public/scripts/girisBekleyen.js?nocache=${Math.random()}"></script>`,
    })
})

router.get('/productImages', (req, res) => {
    res.render('productImages', {
        title: 'Ürün Görselleri',
        scripts: `<script src="/public/scripts/productImages.js?nocache=${Math.random()}"></script>`,
    })
})

router.get('/sbf', (req, res) => {
    res.render('sbf', {
        title: "Sevkiyat Bildirim Formu",
        scripts: '<script src="/public/scripts/sbf.js?nocache=${Math.random()}"></script>'
    })
})

router.get('/createQRCode', (req, res) => {
    res.render('createQRCode', {
        title: "QR Code Üret",
        scripts: '<script src="/public/qrcode/qrcode.min.js"></script><script src="/public/scripts/createQRCode.js?nocache=${Math.random()}"></script>'
    })
})

router.get('/product/detail/:id', (req, res) => {
    res.render('productDetail', {
        title: "Ürün Detayı",
        scripts: '<script>let productId = ' + req.params.id + '</script><script type="module"  src="/public/scripts/productDetail.js?nocache=${Math.random()}"></script>'
    })
})

router.post('/addProduct', (req, res) => {

})

module.exports = router