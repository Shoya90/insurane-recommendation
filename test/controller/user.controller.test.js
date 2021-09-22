const test = require('ava')
const sinon = require('sinon')

const userController = require('../../src/controller/user.controller')
const userService = require('../../src/service/user.service')

test.afterEach(() => {
    sinon.restore()
})

test.serial('createUserWithEmail creates and returns user', t => {
    const user = {
        id: 0,
        email: 'some@email',
        token: 'random-token'
    }

    const storeStub = sinon.stub(userService, 'store').returns(user)

    const storedUser = userController.createUserWithEmail('some@email')

    t.is(storeStub.callCount, 1)
    t.is(storeStub.firstCall.args[0].email, 'some@email')
    t.is(storeStub.firstCall.args[0].token.length, 32)
    t.true(typeof storeStub.firstCall.args[0].token == 'string')

    t.deepEqual(storedUser, user)
})

test.serial('getUserByToken returns user', t => {
    const user = {
        id: 0,
        email: 'some@email',
        token: 'random-token'
    }

    const getUserByTokenStub = sinon.stub(userService, 'getUserByToken').returns(user)

    const storedUser = userController.getUserByToken('random-token')

    t.is(getUserByTokenStub.callCount, 1)
    t.is(getUserByTokenStub.firstCall.args[0], 'random-token')

    t.deepEqual(storedUser, user)
})

test.serial('updateUserQuestionaire updates and returns user', t => {
    const user = {
        id: 0,
        email: 'some@email',
        token: 'random-token',
        questionnaire: {
            name: "name",
            address: "abc str. 123",
            hasChild: true,
            childCount: 2,
            occupationStatus: "EMPLOYED"
        }
    }

    const updateStub = sinon.stub(userService, 'update').returns(user)

    const updatedUser = userController.updateUserQuestionaire(0, user.questionnaire)

    t.is(updateStub.callCount, 1)
    t.is(updateStub.firstCall.args[0], 0)
    t.is(updateStub.firstCall.args[1], user.questionnaire)

    t.deepEqual(updatedUser, user)
})


test.serial('getUserRecommendations returns recommendations based on user questionnaire', t => {
    const user = {
        id: 0,
        email: 'some@email',
        token: 'random-token',
        questionnaire: {
            name: "name",
            address: "abc str. 123",
            hasChild: true,
            childCount: 2,
            occupationStatus: "EMPLOYED"
        }
    }

    const getUserByIdStub = sinon.stub(userService, 'getUserById').returns(user)

    const recommendations = userController.getUserRecommendations(0)

    t.is(getUserByIdStub.callCount, 1)
    t.is(getUserByIdStub.firstCall.args[0], 0)

    t.deepEqual(recommendations, [
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
        },
        {
            name: 'life',
            description: 'some description',
            provider: 'some provider',
            price: 120,
        },
        {
            name: 'job',
            description: 'some description',
            provider: 'some provider',
            price: 20,
        }
    ])

    // change user questionnaire
    user.questionnaire.hasChild = false
    user.questionnaire.occupationStatus = 'STUDENT'

    const newRecommendations = userController.getUserRecommendations(0)

    t.deepEqual(newRecommendations, [
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
        },
        {
            name: 'student',
            description: 'some description',
            provider: 'some provider',
            price: 20,
        }
    ])

})