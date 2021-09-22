const test = require('ava')
const sinon = require('sinon')
const request = require('supertest')
const jwt = require('jsonwebtoken')

const userController = require('../../src/controller/user.controller')

let app

test.beforeEach(() => {
    const appModule = require('../../src/app')
    app = appModule.app
})

test.afterEach(() => {
    sinon.restore()
})

test.serial('POST /user/register registers user and returns a magic link', async t => {
    const email = 'some@email'
    const createUserWithEmailStub = sinon.stub(userController, 'createUserWithEmail').returns({
        email,
        token: 'random-token'
    })

    const res = await request(app).post('/api/v1/auth/register').send({ email })

    t.is(createUserWithEmailStub.callCount, 1)
    t.is(createUserWithEmailStub.firstCall.firstArg, email)

    t.is(res.status, 200)
    t.deepEqual(res.body, {
        magicLink: 'http://localhost:3000/api/v1/auth/magic_link_login?token=random-token'
    })
})

test.serial('POST /auth/register fails if email is not passed in', async t => {
    const createUserWithEmailStub = sinon.stub(userController, 'createUserWithEmail')

    const res = await request(app).post('/api/v1/auth/register').send({ })

    t.is(createUserWithEmailStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"email" is required/)
})

test.serial('GET /auth/magic_link_login thorws error if user not found', async t => {
    const getUserByTokenStub = sinon.stub(userController, 'getUserByToken').returns(undefined)

    const res = await request(app).get('/api/v1/auth/magic_link_login?token=123')

    t.is(getUserByTokenStub.callCount, 1)
    t.is(getUserByTokenStub.firstCall.firstArg, '123')

    t.is(res.status, 400)
    t.deepEqual(res.body, {
        statusCode: 400,
        message: "Invalid magic link",
        error: "Bad Request"
    })
})

test.serial('GET /auth/magic_link_login sends back the accessToken', async t => {
    const getUserByTokenStub = sinon.stub(userController, 'getUserByToken').returns({
        id: 'user-id',
        email: 'some@email',
        token: '123'
    })

    const jwtStub = sinon.stub(jwt, 'sign').returns('accessToken')

    const res = await request(app).get('/api/v1/auth/magic_link_login?token=123')

    t.is(getUserByTokenStub.callCount, 1)
    t.is(getUserByTokenStub.firstCall.firstArg, '123')

    t.deepEqual(jwtStub.firstCall.args[0].sub, 'user-id')
    t.true(jwtStub.firstCall.args[0].exp < Date.now())
    t.is(jwtStub.firstCall.args[1], 'private-string')
    
    t.is(res.status, 200)
    t.deepEqual(res.body, {
        accessToken: 'accessToken'
    })
})