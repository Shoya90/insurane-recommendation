const test = require('ava')
const sinon = require('sinon')
const request = require('supertest')

const userController = require('../../src/controller/user.controller')
const authMiddleware = require('../../src/middleware/auth')

let app

test.beforeEach(() => {
    sinon.stub(authMiddleware, 'checkJwt').callsFake((req, res, next) => {
        req.userId = 'user-id'
        return next()
    }) // stub out the auth

    const appModule = require('../../src/app')
    app = appModule.app
})

test.afterEach(() => {
    sinon.restore()
})

test.serial('GET /user/recommendations gets user recommendation and return an array', async t => {
    const recommendations = [
        {
            name: 'personal liability',
            description: 'some description',
            provider: 'some provider',
            price: 100,
        },
        {
            name: 'public health',
            description: 'some description',
            provider: 'some provider',
            price: 200,
        }
    ]

    const getUserRecommendationsStub = sinon.stub(userController, 'getUserRecommendations').returns(recommendations)

    const res = await request(app).get('/api/v1/user/recommendations')

    t.is(getUserRecommendationsStub.callCount, 1)
    t.is(getUserRecommendationsStub.firstCall.firstArg, 'user-id')

    t.is(res.status, 200)
    t.deepEqual(res.body, recommendations)
})

test.serial('GET /user/recommendations returns 404 if user not found', async t => {
    const getUserRecommendationsStub = sinon.stub(userController, 'getUserRecommendations').returns(undefined)

    const res = await request(app).get('/api/v1/user/recommendations')

    t.is(getUserRecommendationsStub.callCount, 1)
    t.is(getUserRecommendationsStub.firstCall.firstArg, 'user-id')

    t.is(res.status, 404)
    t.is(res.body.message, 'User not found')
})

test.serial('PUT /user/questionnaire fails if validation fails', async t => {
    const updateUserQuestionaireStub = sinon.stub(userController, 'updateUserQuestionaire')

    const res = await request(app).put('/api/v1/user/questionnaire').send({})

    t.is(updateUserQuestionaireStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"name" is required/)
})

test.serial('PUT /user/questionnaire updates and sends user object', async t => {
    const user = {
        email: 'some@email',
        questionnaire: {
            name: 'name',
            hasChild: true,
            childCount: 3,
            occupationStatus: 'EMPLOYED'
        }
    }

    const updateUserQuestionaireStub = sinon.stub(userController, 'updateUserQuestionaire').returns(user)

    const res = await request(app).put('/api/v1/user/questionnaire').send({
        name: 'name',
        hasChild: true,
        childCount: 3,
        occupationStatus: 'EMPLOYED'
    })

    t.is(updateUserQuestionaireStub.callCount, 1)
    t.is(updateUserQuestionaireStub.firstCall.args[0], 'user-id')
    t.deepEqual(updateUserQuestionaireStub.firstCall.args[1], user.questionnaire)

    t.is(res.status, 200)
    t.deepEqual(res.body, user)
})
