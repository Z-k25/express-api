'use strict'

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
    let output
    try {
        output = `${Object.keys(err.keyValue)} со значением ${Object.values(err.keyValue)} уже существует`
    } catch (ex) {
        output = 'Поле уже существует'
    }

    return output
}

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = ''

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Что-то пошло не так'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message
        }
    }

    return message
}

module.exports = getErrorMessage
