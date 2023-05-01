module.exports = class UserDto {
    email;
    id;
    userName;
    avatar;
    isActivated;

    constructor(model) {
        this.avatar = model.avatar || "defaultAvatar.svg"
        this.userName = model.userName;
        this.email = model.email
        this.id = model.id;
        this.isActivated = model.isActivated

    }
}