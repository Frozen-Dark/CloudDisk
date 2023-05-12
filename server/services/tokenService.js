const jwt = require('jsonwebtoken')
const model = require("../models/models")
require('dotenv').config()

class TokenService {
    generateTokens({email, id, userName}) {
        const accessToken = jwt.sign({email, id, userName}, process.env.JWT_ACCESS_KEY, {expiresIn: '10s'} );
        const refreshToken = jwt.sign({email, id, userName}, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'} );
        console.log({
            accessToken,
            refreshToken
        })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await model.Token.findOne({where: {userId: userId} });
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await model.Token.create({userId, refreshToken});
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
            console.log(token, process.env.JWT_ACCESS_KEY)
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            console.log("userData: ", userData)
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