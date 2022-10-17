const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
require('dotenv/config')
const AuthRoute = require('./routes/auth')
const FrogotRoute = require('./routes/forgort')
const transactRoute = require('./routes/transaction')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const path = require('path')

try {
    mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true},
        () => {
          console.log('Connected to MongoDB');
        }
      );
    
} catch (error) {
    console.log(error.message)
}

app.use(helmet())

app.use(helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", "trusted-cdn.com"] }
}))
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'src')))

app.get('', (req, res) => {
    res.render('index')
})

app.use('/auth', AuthRoute)
app.use('/', FrogotRoute)
app.use('/', transactRoute)


app.get('*', (req, res) => {
    const error = `Error 404`
    res.render('404', {error:error})
})

app.post('*', (req, res) => {
    const error = 'Error 404'
    res.render('404', {error:error})
})
var Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`🚀 ${Port}`)
})