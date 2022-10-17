const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneno: { type: Number, required: true, min: 11 },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    amount: { type: Number },
    emailToken:{type:String},
    transactions:[({
        text:{type:String}
    })]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User