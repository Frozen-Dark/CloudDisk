const jwt = require('jsonwebtoken')
const model = require("../models/models")
require('dotenv').config()

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '15m'} );
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'} );
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await model.Token.findOne({where: {userId: userId} });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await model.Token.create({userId: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        const tokenData = await model.Token.findOne({where: {refreshToken: refreshToken} });
        tokenData.destroy();
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await model.Token.findOne({where: {refreshToken: refreshToken} });
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            return userData;
        } catch (e) {
            return null
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
            return userData;
        } catch (e) {
            return null
        }
    }




}

module.exports = new TokenService();