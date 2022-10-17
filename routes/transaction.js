const { verifiedAuth } = require('./verify')
const router = require('express').Router()
const User = require('../models/User')
require('dotenv/config')

router.post('/deposit/:id', verifiedAuth, async (req, res) => {

    const number = parseInt(req.body.amount)


    const user = await User.findById(req.params.id)

    const amount = parseInt(user.amount)
    
    
    if (number) {
        
        const balance = number + amount
        user.amount = parseInt(balance)
        await user.save()
        try {
            const transaction = ({
                text:`Deposited ₦${number} at ${Date().toUTCString()} Balance:${balance}`
            })
            await User.findByIdAndUpdate(req.params.id, {
                $push: {transactions:transaction}
            })
            
        } catch (error) {
            console.log(error)
        }
        const sucess = `you current have ₦${balance} in your account`
        res.status(200).render('sucess', {sucess:sucess})
    } else {
        return res.status(400).send('error')
    }




})

router.post('/withdrawl/:id', verifiedAuth, async (req, res) => {


    const number = parseInt(req.body.amount)

    const user = await User.findById(req.params.id)
    const amount = parseInt(user.amount)

    if (user.amount <= 0) {
        const error = 'Insuficent ammount'
        return res.status(406).render('404', {error:error})
    } else if (user.amount >= number) {
        const balance = amount - number
        user.amount = parseInt(balance)
        await user.save()
        try {
            const transaction =({
                text:`Withdral ₦${number} at ${new Date().toUTCString()}  Balance: ₦${balance}`
            })

            await User.findByIdAndUpdate(req.params.id, {
                $push: {transactions:transaction}
            })
            
        } catch (error) {
            console.log(error)
        }
        const sucess= `you current have ₦${balance} in your account`
        res.status(200).render('sucess', {sucess:sucess})
    } else {
        const error = 'Insufficient amount'
        res.status(400).render('404', {error:error})
    }
})

router.post('/transfer/:id', verifiedAuth, async (req, res) => {
    const number = parseInt(req.body.amount)

    const user = await User.findById(req.params.id)
    const amount = parseInt(user.amount)
    
    const receiver = await User.findOne({ phoneno: req.body.receiver })
    const error = `${req.body.receiver} does not exit`
    if (!receiver) return res.status(401).render('404', {error:error})
    const receiveramount = parseInt(receiver.amount)
    
    const error2 = 'you cannot send to your number'
    if (req.body.receiver == user.phoneno) return res.status(400).render('404', {error:error2})
    
    if (user.amount >= number) {
        const balance = amount - number
        user.amount = parseInt(balance)
        await user.save()
        
        try {
            const transaction =({
                text:`Transferd ₦${number} to ${receiver.phoneno} at ${new Date().toUTCString()} Balance: ₦${balance}`
            })
            await User.findByIdAndUpdate(req.params.id, {
                $push: {transactions:transaction}
            })
        } catch (error) {
            console.log(error)
        }

        try {
            const receiverbalance = receiveramount + number
            receiver.amount = parseInt(receiverbalance)
            await receiver.save()
            try {
                const transaction =({
                    text:`Recived ₦${number} from ${user.phoneno} at ${new Date().toUTCString()} Balance: ₦${receiverbalance}`
                })
                await User.findOneAndUpdate({ phoneno: req.body.receiver }, {
                    $push: { transactions:transaction }
                })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
        const sucess = `you current have ₦${balance} in your account`
        res.status(200).render('sucess', {sucess:sucess})
    } else {
        const error3 = 'Insufficent ammount'
        res.status(403).render('404', {error:error3})
    }


})




router.get('/transactions/:id', verifiedAuth, async (req, res) => {


    const user = await User.findById(req.params.id)
    if (!user) return res.status(400).send('error')

    res.status(200).render('transactions', {user:user, transaction:user.transactions})
})

module.exports = router

