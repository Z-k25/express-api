const express = require('express')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user-routes')
const authRoutes = require('./routes/auth-routes')

const app = express()

app.use(express.json({extended: true}))
app.use(cookieParser())

app.use('/', userRoutes)
app.use('/', authRoutes)


module.exports = app
