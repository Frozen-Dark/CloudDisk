module.exports = function (err, req, res, next) {
    if(err.constructor.name === "ApiError") {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: "Непредвиденная ошибка!", err: err})
}
