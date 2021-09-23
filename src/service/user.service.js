let db = {}
let id = 1

function store(user) {
    db[id] = {
        ...user, id
    }
    id++
    return db[id - 1]
}

function getUserByToken(token) {
    for(let i in db) {
        if(db[i].token == token) {
            return db[i]
        }
    }
}

function update(id, questionnaire) {
    db[id].questionnaire = questionnaire
    return db[id]
}

function getUserById(id) {
    return db[id]
}

module.exports = {
    store,
    getUserByToken,
    update,
    getUserById
}