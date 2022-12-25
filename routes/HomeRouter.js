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

router.get('/girisBekleyen', (req, res) => {
    res.render('girisBekleyen', {
        title: 'Depo Giriş Bekleyenler',
        scripts: `<script src="/public/scripts/girisBekleyen.js"></script>`,
    })
})

router.get('/SevkeHazir', (req, res) => {
    res.render('sevkeHazir', {
        title: 'Sevke Hazır',
        scripts: `<script src="/public/scripts/sevkeHazir.js"></script>`,
    })
})

router.get('/CikisBekleyen', (req, res) => {
    res.render('CikisBekleyen', {
        title: 'Çıkış Bekleyen',
        scripts: `<script src="/public/scripts/CikisBekleyen.js"></script>`,
    })
})


router.get('/currentStatusScreen', (req, res) => {
    res.render('currentStatusScreen', {
        title: 'Gencel Durum Ekranı',
        scripts: `<script src="/public/scripts/currentStatusScreen.js"></script>`,
    })
})

router.get('/sbf', (req, res) => {
    res.render('sbf',{
        title : "Sevkiyat Bildirim Formu",
        scripts : '<script src="/public/scripts/sbf.js"></script>'
    })
})

router.get('/createQRCode', (req, res) => {
    res.render('createQRCode',{
        title : "QR Code Üret",
        scripts : '<script src="/public/qrcode/qrcode.min.js"></script><script src="/public/scripts/createQRCode.js"></script>'
    })
})

module.exports = router