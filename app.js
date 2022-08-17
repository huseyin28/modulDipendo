const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const app = express()
const port = 80
const bodyParser = require('body-parser')
const BaseRouter = require('./routes/BaseRouter')

app.use("/public", express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.set('layout', '_template')

app.use('/', BaseRouter.HomeRouter)
app.use('/auth', BaseRouter.AuthRouter)

app.listen(port)