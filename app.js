const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const app = express()
const port = 3000

app.use("/public",express.static('public'))

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.set('layout', '_layout')

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'CelsanApp | Satış',
        scripts : `<script src="/public/scripts/index.js"></script>`
    })
})

app.get('/detay', (req, res) => {
    res.render('detay', { layout : false})
})

app.listen(port)