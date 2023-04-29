class ApiError extends Error {
    status;
    errors;
    message;
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    static UnauthorizedError(errors = []) {
        return new ApiError(401, "Пользователь не авторизован", errors)
    }

    static BadRequest(message, errors =[]) {
        console.log("BadRequest")
        return new ApiError(404, message, errors)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

}

module.exports = ApiError
