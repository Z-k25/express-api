const express = require('express')
const {create, userById, getById} = require('../controllers/user-controller')
const {requireSignIn, hasAuthorization} = require('../controllers/auth-controller')

const userRoutes = express.Router()

userRoutes.post('/api/register', create)
userRoutes.get('/api/:userId', requireSignIn, hasAuthorization, getById)

userRoutes.param('userId', userById)



module.exports = userRoutes

