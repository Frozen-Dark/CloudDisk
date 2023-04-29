// const jwt = require('jsonwebtoken')
//
// module.exports = function (req, res, next) {
//     try {
//         // console.log("ip: ", req.ip)
//
//         const token = req.headers.authorization.split(' ')[1] // Bearer
//         if (!token) {
//             return res.status(401).json({message: "Не авторизован!" })
//         }
//         let decoded = jwt.verify(token, process.env.SECRET_KEY)
//         req.user = decoded
//         next()
//     } catch (e) {
//         res.status(401).json({message: `Не авторизован!` })
//     }
// };
//

const ApiError = require("../exceptions/apiError")
const tokenService = require("../services/tokenService")
module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return res.status(401).json({message: "Не авторизован"})
        }

        const accessToken = authorizationHeader.split(" ")[1];
        if(!accessToken) {
            return res.status(401).json({message: "Не авторизован"})
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return res.status(401).json({message: "Не авторизован"})
        }
        req.user = userData;
        next();
    } catch (e) {
        next(res.status(401).json({message: "Не авторизован"}))
    }
}