const config = {
    PORT: process.env.PORT || 3000,
    ENV: process.ENV || 'development',
    SECRET: 'private-string',
    CLOUD_URL: process.env.CLOUD_URL || `http://localhost:3000/api/v1`
}

module.exports = config
