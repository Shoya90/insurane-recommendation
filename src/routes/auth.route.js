const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const userController = require('../controller/user.controller')
const config =  require('../config')

const router = new Router()

router.post('/register', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required()
    })
}), (req, res) => {
    const { email } = req.body
    const user = userController.createUserWithEmail(email)

    // instead of sending an email I'm just returning the magic link here for simplicity
    res.send({
        magicLink: `${config.CLOUD_URL}/auth/magic_link_login?token=${user.token}`
    })
})

router.get('/magic_link_login', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        token: Joi.string().required()
    })
}), (req, res, next) => {
    const { token } = req.query
    const user = userController.getUserByToken(token)
    
    if(!user) {
        return next(createError(400, 'Invalid magic link'))
    }

    const jwtToken = jwt.sign({ 
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, config.SECRET)
    
    res.send({
        accessToken: jwtToken
    })
})

module.exports = router