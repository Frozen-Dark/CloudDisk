const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const fileRouter = require('./file.routes')

router.use('/user', userRouter)
router.use('/files', fileRouter)

module.exports = router