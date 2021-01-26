const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: "Введите имя пользователя",
        unique: "Пользователь с таким именем уже существует",
    },

    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Пожалуйста введите валидный адрес почтового ящика'],
        required: "Введите свой email",
        unique: "Пользователь с таким почтовым ящиком уже существует",
    },

    hashed_password: {
        type: String,
        required: 'Введите пароль длиной не менее 6 и не более 20 символов'
    },

    salt: String,

    created: {
        type: Date,
        default: Date.now
    },

    updated: Date
})

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })


UserSchema.methods = {
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },
    encryptPassword: function (plainTextPassword) {
        if (!plainTextPassword) {
            return ''
        }
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(plainTextPassword)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    authenticate: function(plainTextPassword) {
        return this.encryptPassword(plainTextPassword) === this.hashed_password 
    }
}

UserSchema.path('hashed_password').validate(function () {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Длина пароля должна быть не менее 6 символов')
    }
    if (this._password && this._password.length > 20) {
        this.invalidate('password', 'Длина пароля должна быть не более 20 символов')
    }
    if (!this._password) {
        this.invalidate('password', 'Необходимо ввести пароль')
    }
})

UserSchema.path('username')

module.exports = mongoose.model('User', UserSchema)