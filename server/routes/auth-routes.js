const express = require('express')
const {signin, signout} = require('../controllers/auth-controller')

const authRoutes = express.Router()

authRoutes.post('/api/signin', signin)
authRoutes.delete('/api/signout', signout)

module.exports = authRoutes

