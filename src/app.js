const express = require('express')
const http = require('http')
const { errors} = require('celebrate')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const authMiddleware = require('./middleware/auth')
const openApiSConfig = require('./api-docs/config')

const app = express()
const server = http.createServer(app)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(openApiSConfig)))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', authMiddleware.checkJwt, userRouter)

app.use(errors()) // validation error handler
app.use(errorHandler)

function errorHandler(err, req, res, next) {
    const status = err.status || 500

    res.status(status)
    res.send({
        statusCode: status,
        message: status == 500 ? 'server error' : err.message,
        error: http.STATUS_CODES[status]
    })
}

module.exports = {
    app,
    server
}