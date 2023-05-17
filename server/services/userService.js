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
    async registration(email, password) {
        const candidate = await model.User.findOne({where: {email} });
        if(candidate) {
            throw new ApiError(206, 'Пользователь уже существует');
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
        // создаем токены, созхраняем рефреш в бд и отправляем все на клиент

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await model.User.findOne({where: {activationLink: activationLink} })
        if(!user) {
            throw new ApiError(206, 'Неккоректная ссылка активации')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await model.User.findOne({where: {email: email}});
        if(!user) {
            throw new ApiError(206, 'Пользователь не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw new ApiError(206, 'Неккоректный пароль');
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
            throw new ApiError(206, "Нет токена")
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb) {
            throw new ApiError(206, "Нет токена")
        }
        const user = await model.User.findOne({where: {id: userData.id}})
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({email: userDto.email, id: userDto.id, isActivated: userDto.isActivated});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async rename(user, userInfo) {
        const User = await model.User.findOne({where: {email: user.email, id: user.id}});
        User.userName = userInfo.name;
        User.surName = userInfo.surname;
        User.nickName = userInfo.nickname;
        await User.save();

        let userDto;
        userDto = new UserDto(User);
        return userDto;
    }

    async checkName(name) {
        const candidate = await model.User.findOne({where: {email: name}});
        if(candidate) {
            return 206;
        } else {
            return 200;
        }
    }

    async verifyPassword(userData, password) {
        const user = await model.User.findOne({where: {email: userData.email}});
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw new ApiError(206, 'Неккоректный пароль');
        }
        let userDto;
        userDto = new UserDto(user);
        return userDto;
    }

    async changePassword(userData, newPassword) {
        const hashPassword = await bcrypt.hash(newPassword, 3);
        const user = await model.User.findOne({where: {email: userData.email, id: userData.id}});
        user.password = hashPassword;
        await user.save();

        let userDto;
        userDto = new UserDto(user)
        return userDto;
    }
}

module.exports = new UserService()