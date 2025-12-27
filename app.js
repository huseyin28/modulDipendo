// HY Yazılım ürünüdür
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const app = express()
const port = 80
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const HomeRouter = require('./routes/HomeRouter')
const ApiRouter = require('./routes/ApiRouter')
const UploadsRouter = require('./routes/UploadsRouter')

app.use("/public", express.static('public'))
// arttırılmış payload limitleri
const jsonLimit = '50mb'; // ihtiyaca göre  '10mb','100mb' vb. değiştir
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp') // windows için de çalışır
}));
app.use(bodyParser.urlencoded({ extended: false, limit: jsonLimit }))
app.use(bodyParser.json({ limit: jsonLimit }))

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.set('layout', '_template')

app.use('/', HomeRouter)
app.use('/api', ApiRouter)
app.use('/uploads', UploadsRouter)

app.listen(port)