const mongoose = require('mongoose')
const app = require('./express')
const {port, mongoUri} = require('./../config/config')
const PORT = port || 3000

const start = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`))
    } catch (e) {
        throw new Error("Ошибка подключения к базе данных!")
    }
}

start()