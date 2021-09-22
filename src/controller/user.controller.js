const crypto = require('crypto')
const userService = require('../service/user.service')

const RECOMMENDATIONS = {
    'personal liability' : {
        name: 'personal liability',
        description: 'some description',
        provider: 'some provider',
        price: 100,
    },
    'public health' : {
        name: 'public health',
        description: 'some description',
        provider: 'some provider',
        price: 200,
    },
    'private health' : {
        name: 'private health',
        description: 'some description',
        provider: 'some provider',
        price: 500,
    },
    'job' : {
        name: 'job',
        description: 'some description',
        provider: 'some provider',
        price: 20,
    },
    'life' : {
        name: 'life',
        description: 'some description',
        provider: 'some provider',
        price: 120,
    },
    'student': {
        name: 'student',
        description: 'some description',
        provider: 'some provider',
        price: 20,
    }
}

function createUserWithEmail(email) {
    const randomString = crypto.randomBytes(64).toString('hex')
    const hash = crypto.createHash('md5').update(randomString).digest('hex')

    const savedUser = userService.store({ email, token: hash })
    return savedUser
}

function getUserByToken(token) {
    return userService.getUserByToken(token)
}

function updateUserQuestionaire(id, questionnaire) {
    return userService.update(id, questionnaire)
}

function getUserRecommendations(id) {
    const user = userService.getUserById(id)

    let recommendations = []

    recommendations.push(RECOMMENDATIONS['personal liability'])
    recommendations.push(RECOMMENDATIONS['public health'])

    if(user.questionnaire.hasChild) recommendations.push(RECOMMENDATIONS['life'])
    switch (user.questionnaire.occupationStatus) {
        case 'EMPLOYED' || 'SELF-EMPLOYED':
            recommendations.push(RECOMMENDATIONS['job'])
            break
        case 'STUDENT':
            recommendations.push(RECOMMENDATIONS['student'])
            break
    }

    return recommendations
}

module.exports = {
    createUserWithEmail,
    getUserByToken,
    updateUserQuestionaire,
    getUserRecommendations
}