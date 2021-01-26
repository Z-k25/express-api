const User = require('./../models/user-model')
const dbErrorHandler = require('./../../helpers/dbErrorHandler')

const create = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        return res.status(201).json({
            message: 'Пользователь успешно создан'
        })

    } catch (err) {
        res.status(400).json({
            message: dbErrorHandler(err)
        })
    }
}

const userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь с таким id отсутствует'
            })
        }

        req.profile = user

        next()
    } catch (err) {
        res.json({
            message: dbErrorHandler(err)
        })
    }
}

const getById = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    res.json(req.profile)
}

module.exports = {
    create,
    userById,
    getById
}