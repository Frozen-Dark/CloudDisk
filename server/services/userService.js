const model = require("../models/models")
const {where} = require("sequelize");
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require("./mailService")
const tokenService = require("./tokenService")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/apiError")
const fileService = require("./fileService");
const {File} = require("../models/models");
class UserService {
    async registration(email, password, next) {
        const candidate = await model.User.findOne({where: {email} });
        if(candidate) {
            throw ApiError.UnauthorizedError();
        } // Проверка почты

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        // хешируем пароль и создаем ссылку

        const user = await model.User.create({email, password: hashPassword, activationLink: activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
        // создаем пользователя и отправляем ссылку для подтверждения на почту

        await fileService.createDir(new File({userId: user.id, name: ''}));
        // await fileService.createStaticAndPreview(user.id);


        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        console.log("work")
        // создаем токены, созхраняем рефреш в бд и отправляем все на клиент

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await model.User.findOne({where: {activationLink: activationLink} })
        if(!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await model.User.findOne({where: {email: email}});
        if(!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest('Неккоректный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({email: userDto.email, id: userDto.id, isActivated: userDto.isActivated});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async authorization(userData) {
        const {email} = userData
        const user = await model.User.findOne({where: {email}})
        const userDto = new UserDto(user)
        console.log(userDto)
        const {accessToken, refreshToken} = tokenService.generateTokens({email: userDto.email, id: userDto.id, isActivated: userDto.isActivated})
        await tokenService.saveToken(userDto.id, refreshToken);

        return {accessToken, refreshToken, user: userDto}

    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await model.User.findOne({where: {id: userData.id}})
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({email: userDto.email, id: userDto.id, isActivated: userDto.isActivated});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async rename(user, userInfo) {
        console.log(user, userInfo);
        const User = await model.User.findOne({where: {email: user.email, id: user.id}});
        User.userName = userInfo.name;
        User.surName = userInfo.surname;
        User.nickName = userInfo.nickname;
        await User.save()
        return new UserDto(User)
    }
    async changePassword(userData, newPassword) {
        const hashPassword = await bcrypt.hash(newPassword, 3);
        const user = await model.User.findOne({where: {email: userData.email, id: userData.id}});
        user.password = hashPassword;
        await user.save();
        return new UserDto(user);
    }

    // async getAllUsers() {
    //     const users = await model.User.findAll();
    //     return users;
    // }
}

module.exports = new UserService()