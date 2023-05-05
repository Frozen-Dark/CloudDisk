module.exports = class UserDto {
    email;
    id;
    avatar;
    isActivated;
    userName;
    surName;
    nickName;
    usedSpace;
    diskSpace;


    constructor(model) {
        this.avatar = model.avatar || "defaultAvatar.svg"
        this.userName = model.userName;
        this.email = model.email
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.surName = model.surName;
        this.nickName = model.nickName;
        this.usedSpace = model.usedSpace;
        this.diskSpace = model.diskSpace;
    }
}