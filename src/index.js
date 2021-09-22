const { server, app } = require('./app')
const config = require('./config')

const PORT = config.PORT
app.set('env', config.ENV)

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})