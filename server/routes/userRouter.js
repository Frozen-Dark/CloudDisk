const Router = require('express')
const router = new Router()
const userController = require ('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const fileController = require("../controllers/fileController");
const {body} = require("express-validator")

// router.post('/registration', userController.registration)
// router.post('/login', userController.login)
// router.get('/auth', authMiddleware, userController.auth)

router.post("/registration",
    body("email").isEmail(),
    body("password").isLength({min: 6, max: 32}),
    userController.registration)
router.post("/login", userController.login)
router.post("/logout", userController.logout)
router.post("/rename", authMiddleware, userController.renaming)
router.get("/activate/:link", userController.activate)
router.get("/refresh",  userController.refresh)
router.get("/authorization", authMiddleware, userController.authorization)
// router.get("/users", authMiddleware, userController.getUsers)






module.exports = router