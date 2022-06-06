const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs');

app.use("/public",express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.post('/createEtiket', (req, res) => {
    let data = `${req.body.sipno}\n`+
    req.body.customer+"\n"+
    req.body.size.replace("mm", "")+"\n"+
    req.body.tanim.replace("UNGALV", "").replace("RHRL", "").replace("RHLL", "").replace("LHRL", "SOL").replace("LHLL", "SOL")+"\n"+
    req.body.metraj+"\n"+
    req.body.agirlik+"\n"+
    req.body.pid
    fs.writeFile(path.join(__dirname,"/etiket.txt"), "ascii", data, err => {
        if (err)
            res.json({success : false})
        else
            res.json({success : true})
    })
})

app.get('/detay2', (req, res) => {
    res.render('detay2', { 
        title: 'CelsanApp | Detay2',
        scripts : `<script src="/public/scripts/detay2.js"></script>`
    })
})

app.listen(port)