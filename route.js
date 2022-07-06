const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'CelsanApp | Satış',
        scripts: `<script src="/public/scripts/index.js"></script>`
    })
})

router.get('/demo', (req, res) => {
    res.render('demo', {
        title: 'CelsanApp | Demo',
        scripts: `<script src="/public/scripts/demo.js"></script>`
    })
})

router.get('/detay', (req, res) => {
    res.render('detay', { layout: false })
})

router.post('/createEtiket', (req, res) => {
    let customer = req.body.customer;
    customer = customer.split(" ")

    let data = `${req.body.sipno}\n`+
    customer[0]+' '+customer[1]+"\n"+
    // "İiIıÜüĞğŞşÇçÖö"+"\n"+
    req.body.size.replace("mm", "")+"\n"+
    req.body.tanim.replace("UNGALV", "").replace("RHRL", "").replace("RHLL", "").replace("LHRL", "SOL").replace("LHLL", "SOL")+"\n"+
    req.body.metraj+"\n"+
    req.body.agirlik+"\n"+req.body.pid
    
    data = data.replace("Ş","S",data)
    data = data.replace("İ","I",data)
    data = data.replace("Ğ","G",data)
    data = data.replace("ş","s",data)
    data = data.replace("ı","i",data)
    data = data.replace("ğ","g",data)
    
    fs.writeFile(path.join(__dirname,"/etiket.txt"), data, 'ascii', (err) => {
        if (err)
            res.json({success : false})
        else
            res.json({success : true})
    })
})

module.exports = router