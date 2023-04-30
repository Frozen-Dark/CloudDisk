module.exports = class UserDto {
    email;
    id;
    avatar;
    isActivated;

    constructor(model) {
        this.avatar = model.avatar || "defaultAvatar.svg"
        this.email = model.email
        this.id = model.id;
        this.isActivated = model.isActivated
    }
}