const express = require('express')
const router = express.Router()

router.use('/auth', require('./authRoutes'))
router.use('/user', require('./userRoute'))

module.exports = router