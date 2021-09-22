const jwt = require('jsonwebtoken')
const config =  require('../config')

function checkJwt(req, res, next) {
  const authHeader = req.headers.authorization
  if(authHeader) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.decode(token, config.SECRET)
      req.userId = decoded.sub
      next()
    } catch (error) {
      res.status(403)
      res.send({ error: 'access denied' })
    }
  } else {
    res.sendStatus(401)
  }
}

module.exports = {
  checkJwt
}
