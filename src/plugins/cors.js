const cors = require('cors')
require('dotenv').config()

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : []

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}

module.exports = cors(corsOptions)
