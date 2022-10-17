const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = require('express').Router()
require('dotenv/config')


router.post('/signup', async (req, res) => {

    
    const userExist = await User.findOne({ email: req.body.email })
    const error = `${req.body.email} already exit`
    if (userExist) return res.status(405).render('404',{error:error})
    
    const usernameExist = await User.findOne({ username: req.body.username })
    const error2 = `${req.body.username} already exist `
    if (usernameExist) return res.status(405).render('404', {error:error2})
    const phoneExist = await User.findOne({ phoneno: req.body.phoneno })
    const error3 = `${req.body.phoneno} alredy exist`
    if (phoneExist) return res.status(405).render('404', {error:error3})
    

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const newUser = await new User({
        username: req.body.username,
        password: password,
        email: req.body.email,
        phoneno: req.body.phoneno,
        amount: 0

    })

    try {
        const savedUser = await newUser.save()
        const token = jwt.sign({id:savedUser._id, isAdmin: savedUser.isAdmin}, process.env.TOKEN,{expiresIn: '5h'})
        res.cookie('token', token)
        res.status(200).render('user',{user:savedUser})
    } catch (error) {
        res.status(400).send(error.message)        
    }
})

router.get('/login', (req, res)=>{
    res.status(301).render('login')
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const error = `${req.body.email} does not exist`
    if (!user) return res.status(400).render('404', {error:error})
    
    const valid = await bcrypt.compare(req.body.password, user.password)
    const error2 = 'password not correct' 
    if (!valid) return res.status(400).render('404',{error:error2})
    
    const { password, isAdmin,emailToken,...others } = user._doc
    const token = jwt.sign({id:user._id, isAdmin: user.isAdmin}, process.env.TOKEN,{expiresIn: '5h'})

    res.cookie('token', token)
    res.status(200).render('user', {user:user})
})

module.exports = router