const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const User = require('./../models/user-model')
const {
    jwtSecret
} = require('./../../config/config')

const signin = async (req, res) => {
    const user = await User.findOne({
        email: req.body.login
    }) || await User.findOne({
        username: req.body.login
    })

    if (!user) {
        return res.status(401).json({
            message: "Пользователя c таким логином или почтой не существует"
        })
    }

    const isMatch = user.authenticate(req.body.password)

    if (!isMatch) {
        return res.status(401).json({
            message: "Неверные логин или пароль"
        })
    }
    try {
        const token = jwt.sign({
                _id: user._id
            },
            jwtSecret,
        )

        res.cookie('t', token, {
            expire: new Date() + 9999
        })

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(401).json({
            message: "Ошибка авторизации"
        })
    }
}

const signout = async (req, res) => {
    res.clearCookie('t')
    res.status(200).json({
        message: "Успешный выход из приложения"
    })
}

const requireSignIn = expressJwt({
    secret: jwtSecret,
    requestProperty: 'auth',
    algorithms: ['HS256']
})

const hasAuthorization = (req, res, next) => {
    const isAuthorized = req.profile && req.auth._id && req.profile._id == req.auth._id
    if (!isAuthorized) {
        return res.status(401).json({message: 'Авторизация не пройдена'})
    }
    next()
}


module.exports = {
    signin,
    signout,
    requireSignIn,
    hasAuthorization
}