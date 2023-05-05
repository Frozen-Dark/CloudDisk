const userService = require("../services/userService")
const {validationResult} = require("express-validator")
const ApiError = require("../exceptions/apiError")

class UserController {
    async renaming(req, res, next) {
        try {
            const userData = req.user

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // ВОТ СЮДА ПРИ HTTPS ДОБАВЛЯТЬ  secure: true
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async authorization(req, res, next) {
        try {
            const userData = req.user;
            const {accessToken, refreshToken, user} = await userService.authorization(userData);
            res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({token: accessToken, user: {...user}});
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            console.log("asd")

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // ВОТ СЮДА ПРИ HTTPS ДОБАВЛЯТЬ  secure: true
            console.log("asd")
            return res.json({token: userData.accessToken, user: userData.user})
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json({message: "Вы вышли с учетной записи"})
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)

        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    // async getUsers(req, res, next) {
    //     try {
    //         const users = await userService.getAllUsers();
    //         return res.json(users);
    //     } catch (e) {
    //         next(e)
    //     }
    // }

}

module.exports = new UserController()