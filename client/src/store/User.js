import {makeAutoObservable} from "mobx";

class User {
    constructor() {
        makeAutoObservable(this)
    }

    currentUser = {
        id: 0,
        avatar: "defaultAvatar.svg",
        email: "",
        diskSpace: 0,
        usedSpace: 0,
        userName: ""
    };

    setCurrentUser = (user) => {
        this.currentUser = user
    }

}

export default new User();