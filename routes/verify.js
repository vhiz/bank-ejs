const jwt = require('jsonwebtoken')
require('dotenv/config')

const verified = (req, res, next) => {
    const token = req.cookies.token

    if(token){
        jwt.verify(token, process.env.TOKEN, (err, verified)=>{
            if(err)return res.status(401).redirect('/')
            req.user = verified
            next()
        })
    }else{
        return res.status(401).redirect('/')
    }
}

const verifiedAuth = (req, res, next) => {
    verified(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next()
        } else {
            const error= 'Unautorized'
            return res.status(401).render('404', {error:error})
        }
    })
}

const verifiedAdmin = (req, res, next) => {
    verified(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            const error= 'Unautorized'
            res.status(400).render('404', {error:error})
        }
    })
}


module.exports = { verifiedAuth, verifiedAdmin }