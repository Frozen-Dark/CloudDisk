import {makeAutoObservable} from "mobx";
import Auth from "./Auth";
import {logout} from "../actions/user";

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
        userName: "User",
        surName: "1",
        nickName: "",
    };

    logout = () => {
        Auth.setIsAuth(false)
        localStorage.removeItem("token");
        localStorage.setItem("lastDir", "-1");
        localStorage.setItem("fileList", "true");
        logout()
    }

    setCurrentUser = (user) => {
        this.currentUser = {...user}
        console.log(user)
    }

}

export default new User();