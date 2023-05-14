module.exports = function (err, req, res, next) {

    if(err.constructor.name === "ApiError") {
        console.log(err.status, {message: err.message})
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "Непредвиденная ошибка!", err: err})
}
