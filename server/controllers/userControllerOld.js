require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, File} = require('../models/models')
const fileService = require('../services/fileService')
const ApiError = require("../exceptions/ApiError");

const generateJwt = (id, email) => {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )

}

class UserControllerOld {
    async auth(req, res) {
        const user = await User.findOne({where: {id: req.user.id}});
        const token = generateJwt(user.id, user.email);
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }});
    }

    async registration(req, res, next) {
            const {email, password} = req.body

            if(!email || !password) {// Проверка данных
                return next(ApiError.BadRequest('Неккоректная почта или пароль'))
            }
            const candidate = await User.findOne({where: {email}});                             // Вытаскиваем данные с бд
            if(candidate) {                                                                     // Проверка пользователя
                return next(ApiError.BadRequest('Пользователь с такой почтой уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            // Шифруем пароль

            const user = await User.create({email, password: hashPassword});
            // Создаем пользователя
            await fileService.createDir(new File({userId: user.id, name: ''}));

            const token = generateJwt(user.id, user.email);

            return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }});
    }
    async login(req, res, next) {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});
            if(!user) {
                return next(ApiError.internal("Пользователь с таким именем не найден"));
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal("Указан неверный пароль"));
            }
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            });
    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email);
        return res.json({token});
    }


}

module.exports = new UserControllerOld();







