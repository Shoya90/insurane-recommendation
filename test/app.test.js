const test = require('ava')
const request = require('supertest')

test.serial('App initializes and sets up the routes', async t => {
    const { app } = require('../src/app')

    const res = await request(app).get('/api-docs/')
    t.is(res.status, 200)
})   