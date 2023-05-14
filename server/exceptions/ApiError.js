class ApiError extends Error {
    status;
    errors;
    message;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован")
    }

    static BadRequest(message) {
        return new ApiError(404, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

}

module.exports = ApiError
