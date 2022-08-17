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

router.get('/demo', (req, res) => {
    res.render('demo', {
        title: 'Demo',
        scripts: `<script src="/public/scripts/demo.js"></script>`
    })
})

router.get('/formPrint/:id', (req, res) => {
    res.render('formPrint', {
        layout : false,
        scripts: `<script src="/public/scripts/formPrint.js"></script>`,
        saleId : `<script>const saleId = ${req.params.id}; </script>`
    })
})
 
router.get('/detay', (req, res) => {
    res.render('detay',{
        title: 'Detay',
        scripts: `<script src="/public/scripts/detay.js"></script>`
    })
})

router.post('/createEtiket', (req, res) => {
    let customer = req.body.customer;
    customer = customer.split(" ")

    let data = `${req.body.sipno.trim()}\n`+
    customer[0]+' '+customer[1]+"\n"+
    req.body.size.replace("mm", "")+"\n"+
    req.body.tanim.replace("UNGALV", "").replace("RHRL", "").replace("RHLL", "").replace("LHRL", "SOL").replace("LHLL", "SOL")+"\n"+
    req.body.metraj+"\n"+
    req.body.agirlik+"\n"+req.body.pid
    
    data = data.replaceAll("Ş","S",data)
    data = data.replaceAll("İ","I",data)
    data = data.replaceAll("Ğ","G",data)
    data = data.replaceAll("ş","s",data)
    data = data.replaceAll("ı","i",data)
    data = data.replaceAll("ğ","g",data)
    data = data.replaceAll("Ç","C",data)
    data = data.replaceAll("ö","o",data)
    data = data.replaceAll("Ö","O",data)
    data = data.replaceAll("ç","c",data)
    
    fs.writeFile(path.join(__dirname,"/../etiket.txt"), data, 'ascii', (err) => {
        if (err)
            res.json({success : false})
        else
            res.json({success : true})
    })
})

module.exports = router