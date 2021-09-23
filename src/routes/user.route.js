const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
const createError = require('http-errors')

const userController = require('../controller/user.controller')

const router = new Router()

router.put('/questionnaire', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        address: Joi.string(),
        childCount: Joi.number().default(0),
        hasChild:  Joi.boolean().required(),
        occupationStatus: Joi.string().required().valid('EMPLOYED', 'STUDENT', 'SELF-EMPLOYED'),
    })
}), (req, res) => {
    const user = userController.updateUserQuestionaire(req.userId, req.body)
    res.send(user)
})

router.get('/recommendations', (req, res, next) => {
    const recommendations =  userController.getUserRecommendations(req.userId)

    if(!recommendations) {
        return next(createError(404, 'User not found'))
    }

    res.send(recommendations)
})

module.exports = router