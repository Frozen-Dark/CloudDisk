import {makeAutoObservable} from "mobx";

class User {
    constructor() {
        makeAutoObservable(this)
    }

    currentUser = {
        id: 0,
        avatar: "defaultAvatar.svg",
        email: "test@test.test",
        diskSpace: 0,
        usedSpace: 0,
        userName: "User"
    };

    setCurrentUser = (user) => {
        this.currentUser = {...user}
        console.log(user)
    }

}

export default new User();